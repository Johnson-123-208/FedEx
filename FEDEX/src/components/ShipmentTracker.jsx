import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map controller for programmatic updates
const MapController = ({ center, zoom }) => {
    const map = useMap();

    useEffect(() => {
        if (center && map) {
            map.setView(center, zoom, { animate: true, duration: 0.5 });
        }
    }, [center, zoom, map]);

    return null;
};

// Helper to calculate bearing between two points
const getBearing = (startLat, startLng, endLat, endLng) => {
    if (!Number.isFinite(startLat) || !Number.isFinite(startLng) ||
        !Number.isFinite(endLat) || !Number.isFinite(endLng)) {
        return 0;
    }

    const startLatRad = startLat * (Math.PI / 180);
    const startLngRad = startLng * (Math.PI / 180);
    const endLatRad = endLat * (Math.PI / 180);
    const endLngRad = endLng * (Math.PI / 180);

    const dLng = endLngRad - startLngRad;

    const y = Math.sin(dLng) * Math.cos(endLatRad);
    const x = Math.cos(startLatRad) * Math.sin(endLatRad) -
        Math.sin(startLatRad) * Math.cos(endLatRad) * Math.cos(dLng);

    const brng = Math.atan2(y, x);
    const deg = (brng * 180 / Math.PI + 360) % 360;
    return isNaN(deg) ? 0 : deg;
};

// Shipment icon (Airplane) with rotation
const createShipmentIcon = (rotation = 0) => new L.DivIcon({
    html: `
        <div style="
            width: 32px;
            height: 32px;
            background: #4D148C;
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            transform: rotate(${rotation}deg);
            transition: transform 0.3s ease;
        ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style="transform: translateY(-1px);">
                <path d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z"/>
            </svg>
        </div>
    `,
    className: 'shipment-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
});

// Checkpoint marker icons
const createCheckpointIcon = (status) => {
    const colors = {
        completed: '#10B981',
        current: '#4D148C',
        pending: '#D1D5DB'
    };

    return new L.DivIcon({
        html: `
            <div style="
                width: 12px;
                height: 12px;
                background: ${colors[status]};
                border: 2px solid white;
                border-radius: 50%;
                box-shadow: 0 1px 4px rgba(0,0,0,0.2);
            "></div>
        `,
        className: 'checkpoint-marker',
        iconSize: [12, 12],
        iconAnchor: [6, 6],
    });
};


const ShipmentTracker = ({ shipment }) => {
    const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);
    const [mapZoom, setMapZoom] = useState(4);
    const [animatedPosition, setAnimatedPosition] = useState(null);
    const [shipmentRotation, setShipmentRotation] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [checkpoints, setCheckpoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);


    // Parse location string to extract meaningful search terms
    const parseLocation = (locationStr) => {
        if (!locationStr) return '';

        let cleaned = locationStr.trim();

        // Extract country code in brackets [XX]
        const countryCodeMatch = cleaned.match(/\[([A-Z]{2})\]/);
        const countryCode = countryCodeMatch ? countryCodeMatch[1] : null;

        // Remove brackets content
        cleaned = cleaned.replace(/\[.*?\]/g, '').trim();

        // Country code to name mapping
        const countryMap = {
            'IE': 'Ireland',
            'DE': 'Germany',
            'GB': 'United Kingdom',
            'UK': 'United Kingdom',
            'US': 'United States',
            'IN': 'India',
            'FR': 'France',
            'IT': 'Italy',
            'ES': 'Spain',
            'NL': 'Netherlands',
            'BE': 'Belgium',
            'CH': 'Switzerland',
            'AT': 'Austria',
            'CN': 'China',
            'JP': 'Japan',
            'AE': 'United Arab Emirates',
            'SA': 'Saudi Arabia',
            'SG': 'Singapore',
            'MY': 'Malaysia',
            'TH': 'Thailand'
        };

        // Special handling for Indian states/cities
        const indianCities = {
            'TELANGANA': 'Hyderabad, India',
            'HYDERABAD': 'Hyderabad, India',
            'MUMBAI': 'Mumbai, India',
            'DELHI': 'Delhi, India',
            'BANGALORE': 'Bangalore, India',
            'CHENNAI': 'Chennai, India',
            'KOLKATA': 'Kolkata, India'
        };

        // Special handling for US cities
        const usCities = {
            'EL PASO': 'El Paso, Texas, United States',
            'NEW YORK': 'New York, United States',
            'LOS ANGELES': 'Los Angeles, United States',
            'CHICAGO': 'Chicago, United States',
            'HOUSTON': 'Houston, United States'
        };

        // Check for Indian cities
        const upperCleaned = cleaned.toUpperCase();
        for (const [key, value] of Object.entries(indianCities)) {
            if (upperCleaned.includes(key)) {
                return value;
            }
        }

        // Check for US cities
        for (const [key, value] of Object.entries(usCities)) {
            if (upperCleaned.includes(key)) {
                return value;
            }
        }

        // If we have a country code, use it
        if (countryCode && countryMap[countryCode]) {
            if (cleaned) {
                return `${cleaned}, ${countryMap[countryCode]}`;
            }
            return countryMap[countryCode];
        }

        // Check if location already contains country name
        const knownCountries = ['GERMANY', 'FRANCE', 'ITALY', 'SPAIN', 'INDIA', 'CHINA', 'UNITED STATES'];
        for (const country of knownCountries) {
            if (upperCleaned.includes(country)) {
                return cleaned;
            }
        }

        return cleaned;
    };

    // Create intermediate waypoints for long-distance routes
    const createWaypoints = (start, end, count = 3) => {
        const waypoints = [];

        // Calculate great circle distance
        const latDiff = Math.abs(end.lat - start.lat);
        const lngDiff = Math.abs(end.lng - start.lng);

        // If crossing major longitude (likely crossing ocean), add waypoints
        if (lngDiff > 90) {
            // Trans-oceanic route - add waypoints at logical transit hubs
            const midLat = (start.lat + end.lat) / 2;

            // Determine if going east or west
            const goingEast = end.lng > start.lng;

            // Add waypoints at typical air cargo hubs
            if (goingEast) {
                // India to US route typically goes via Middle East/Europe
                waypoints.push(
                    { lat: 25.2532, lng: 55.3657 }, // Dubai
                    { lat: 51.4700, lng: -0.4543 }  // London Heathrow
                );
            } else {
                // US to Asia route typically goes via Pacific
                waypoints.push(
                    { lat: 35.7720, lng: 140.3929 }, // Tokyo
                    { lat: 22.3080, lng: 113.9185 }  // Hong Kong
                );
            }
        } else {
            // Continental route - simple interpolation is fine
            for (let i = 1; i < count; i++) {
                const ratio = i / count;
                waypoints.push({
                    lat: start.lat + (end.lat - start.lat) * ratio,
                    lng: start.lng + (end.lng - start.lng) * ratio
                });
            }
        }

        return waypoints;
    };

    // Geocode location name to coordinates with retry
    const geocodeLocation = async (locationName) => {
        const parsedLocation = parseLocation(locationName);

        if (!parsedLocation) return null;

        try {
            // Reduced delay to speed up loading (100ms between requests)
            await new Promise(resolve => setTimeout(resolve, 100));

            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(parsedLocation)}&limit=1`,
                {
                    headers: {
                        'User-Agent': 'FedEx-Tracking-App/1.0'
                    }
                }
            );

            if (!response.ok) {
                console.warn(`Geocoding HTTP error for ${locationName}:`, response.status);
                return null;
            }

            const data = await response.json();

            if (data && data.length > 0) {
                const coords = {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon)
                };
                console.log(`Geocoded "${locationName}" to:`, coords);
                return coords;
            }

            console.warn(`No geocoding results for: ${locationName}`);
            return null;
        } catch (error) {
            console.error('Geocoding error for', locationName, error);
            return null;
        }
    };

    // Parse timeline and geocode locations
    useEffect(() => {
        const loadCheckpoints = async () => {
            if (!shipment?.timeline || !shipment?.coordinates) {
                setLoading(false);
                return;
            }

            const { origin, destination } = shipment.coordinates;

            // Strict validation of origin and destination coordinates
            if (!origin || !destination ||
                !Number.isFinite(Number(origin.lat)) || !Number.isFinite(Number(origin.lng)) ||
                !Number.isFinite(Number(destination.lat)) || !Number.isFinite(Number(destination.lng)) ||
                origin.lat < -90 || origin.lat > 90 || origin.lng < -180 || origin.lng > 180 ||
                destination.lat < -90 || destination.lat > 90 || destination.lng < -180 || destination.lng > 180) {
                console.error('Invalid origin/destination coordinates:', { origin, destination });
                setLoading(false);
                return;
            }

            // Ensure coordinates are numbers
            const validOrigin = { lat: Number(origin.lat), lng: Number(origin.lng) };
            const validDestination = { lat: Number(destination.lat), lng: Number(destination.lng) };

            // Sort timeline chronologically (Oldest -> Newest) to ensure correct path order
            // This prevents zig-zag lines caused by events being out of order
            const sortTimeline = (events) => {
                return [...events].sort((a, b) => {
                    const dateA = parseDate(a.date);
                    const dateB = parseDate(b.date);
                    return dateA - dateB;
                });
            };

            // Helper to parse date strings like "10/11/2025 6:21 PM"
            const parseDate = (dateStr) => {
                if (!dateStr) return 0;
                try {
                    // Try parsing "DD/MM/YYYY HH:MM AM/PM"
                    // Remove any non-standard chars and normalize
                    const cleanStr = dateStr.replace(/(\d+)(st|nd|rd|th)/, '$1');

                    const parts = cleanStr.match(/(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})\s+(\d{1,2}):(\d{2})\s*([APap][Mm])?/);

                    if (parts) {
                        const day = parseInt(parts[1]);
                        const month = parseInt(parts[2]) - 1; // 0-indexed
                        const year = parseInt(parts[3]);
                        let hour = parseInt(parts[4]);
                        const minute = parseInt(parts[5]);
                        const meridian = parts[6] ? parts[6].toUpperCase() : null;

                        if (meridian === 'PM' && hour < 12) hour += 12;
                        if (meridian === 'AM' && hour === 12) hour = 0;

                        return new Date(year, month, day, hour, minute).getTime();
                    }

                    // Fallback to standard date parse
                    return new Date(dateStr).getTime();
                } catch (e) {
                    return 0;
                }
            };

            // Sort the timeline
            let timeline = sortTimeline(shipment.timeline);

            // If sort resulted in invalid order (all 0s) or no change,
            // fall back to simple reverse assuming Newest-First input
            const times = timeline.map(e => parseDate(e.date));
            const isSorted = times.every((t, i) => i === 0 || t >= times[i - 1]);

            if (!isSorted || times.every(t => t === 0) || times.every(t => isNaN(t))) {
                console.log("Date sorting failed or inconclusive, falling back to reverse");
                timeline = [...shipment.timeline].reverse();
            }

            setLoading(true);

            const checkpointPromises = timeline.map(async (event, index) => {
                let coords;
                const isFirst = index === 0;
                const isLast = index === timeline.length - 1;

                if (isFirst) {
                    // First chronological event = origin (where shipment started)
                    coords = validOrigin;
                    console.log(`Checkpoint ${index}: Origin -`, event.location, coords);
                } else if (isLast) {
                    // Last chronological event = destination (where shipment is going)
                    coords = validDestination;
                    console.log(`Checkpoint ${index}: Destination -`, event.location, coords);
                } else {
                    // Middle checkpoints - only geocode key waypoints for faster loading
                    const shouldGeocode = timeline.length <= 5 || index % 3 === 0;

                    if (shouldGeocode) {
                        coords = await geocodeLocation(event.location);
                    }

                    // If geocoding fails or skipped, skip this checkpoint
                    if (!coords) {
                        if (shouldGeocode) {
                            console.warn(`Skipping checkpoint ${index}: geocoding failed for "${event.location}"`);
                        }
                        return null;
                    }
                }

                // Strict validation of coordinates before returning
                if (!coords ||
                    typeof coords !== 'object' ||
                    !Number.isFinite(coords.lat) ||
                    !Number.isFinite(coords.lng) ||
                    coords.lat < -90 || coords.lat > 90 ||
                    coords.lng < -180 || coords.lng > 180) {
                    console.error(`Invalid coordinates for checkpoint ${index}:`, event.location, coords);
                    return null;
                }

                return {
                    id: index,
                    status: event.status,
                    location: event.location,
                    date: event.date,
                    completed: event.completed,
                    coordinates: {
                        lat: Number(coords.lat),
                        lng: Number(coords.lng)
                    },
                    isFirst,
                    isLast
                };
            });

            const resolvedCheckpoints = (await Promise.all(checkpointPromises)).filter(cp => cp !== null);
            console.log('Total valid checkpoints:', resolvedCheckpoints.length);
            setCheckpoints(resolvedCheckpoints);
            setLoading(false);
        };

        loadCheckpoints();
    }, [shipment]);

    // Determine current checkpoint (last completed or second-to-last for animation)
    const currentCheckpointIndex = useMemo(() => {
        if (checkpoints.length === 0) return 0;

        // Find first uncompleted checkpoint
        const firstUncompleted = checkpoints.findIndex(cp => !cp.completed);

        if (firstUncompleted === -1) {
            // All completed (delivered) - animate between last two points
            return Math.max(0, checkpoints.length - 2);
        } else if (firstUncompleted === 0) {
            // Nothing completed yet - start at origin
            return 0;
        } else {
            // Return the last completed checkpoint
            return firstUncompleted - 1;
        }
    }, [checkpoints]);

    // Animate shipment movement between checkpoints
    useEffect(() => {
        if (checkpoints.length === 0 || selectedCheckpoint !== null) return;

        const current = checkpoints[currentCheckpointIndex];
        const next = checkpoints[currentCheckpointIndex + 1];

        if (!current) return;

        // If there's a next checkpoint and we're not at the end, animate
        if (next && currentCheckpointIndex < checkpoints.length - 1) {
            setIsAnimating(true);

            const startLat = current.coordinates.lat;
            const startLng = current.coordinates.lng;
            const endLat = next.coordinates.lat;
            const endLng = next.coordinates.lng;

            // Calculate bearing for airplane rotation
            const bearing = getBearing(startLat, startLng, endLat, endLng);
            setShipmentRotation(bearing);

            let progress = 0;
            const duration = 4000; // Slower, smoother animation
            const steps = 120; // Higher frame rate
            const stepDuration = duration / steps;

            const interval = setInterval(() => {
                progress += 1 / steps;

                if (progress >= 1) {
                    // Reset to start for continuous loop
                    progress = 0;
                }

                // Linear interpolation
                const lat = startLat + (endLat - startLat) * progress;
                const lng = startLng + (endLng - startLng) * progress;
                setAnimatedPosition({ lat, lng });

            }, stepDuration);

            return () => clearInterval(interval);
        } else {
            // At current position
            setAnimatedPosition(current.coordinates);
            setShipmentRotation(0); // Default rotation
        }
    }, [checkpoints, currentCheckpointIndex, selectedCheckpoint]);

    // Set initial map view
    useEffect(() => {
        if (checkpoints.length > 0 && !mapCenter) {
            const current = checkpoints[currentCheckpointIndex];
            if (current) {
                setMapCenter([current.coordinates.lat, current.coordinates.lng]);
                setMapZoom(5);
            }
        }
    }, [checkpoints, currentCheckpointIndex, mapCenter]);

    // Handle checkpoint selection
    const handleCheckpointClick = (checkpoint) => {
        setSelectedCheckpoint(checkpoint.id);
        setMapCenter([checkpoint.coordinates.lat, checkpoint.coordinates.lng]);
        setMapZoom(6);
        setAnimatedPosition(checkpoint.coordinates);
    };

    // Calculate route line
    const routeLine = useMemo(() => {
        return checkpoints.map(cp => [cp.coordinates.lat, cp.coordinates.lng]);
    }, [checkpoints]);

    // Active checkpoint for display
    const activeCheckpoint = selectedCheckpoint !== null
        ? checkpoints[selectedCheckpoint]
        : checkpoints[currentCheckpointIndex];

    // Memoize shipment icon to avoid re-creation during animation
    const shipmentIcon = useMemo(() => createShipmentIcon(shipmentRotation), [shipmentRotation]);

    // Shipment position (animated or selected)
    const shipmentPosition = animatedPosition || activeCheckpoint?.coordinates;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[600px] bg-[#F5F5F5] rounded-xl">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading tracking data...</p>
                    <p className="text-xs text-slate-400 mt-1">Geocoding checkpoint locations</p>
                </div>
            </div>
        );
    }

    if (!shipment || checkpoints.length === 0) {
        return (
            <div className="flex items-center justify-center h-full min-h-[500px] bg-[#F5F5F5] rounded-xl">
                <p className="text-slate-500">No tracking data available</p>
            </div>
        );
    }

    // Validate that we have valid coordinates before rendering map
    const hasValidCoordinates = checkpoints.some(cp =>
        cp.coordinates &&
        !isNaN(cp.coordinates.lat) &&
        !isNaN(cp.coordinates.lng)
    );

    if (!hasValidCoordinates) {
        return (
            <div className="flex items-center justify-center h-[600px] bg-[#F5F5F5] rounded-xl">
                <div className="text-center">
                    <p className="text-slate-600 font-medium mb-2">Unable to load map</p>
                    <p className="text-xs text-slate-400">Invalid coordinate data</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
            {/* Timeline - Left Side */}
            <div className="lg:w-80 flex-shrink-0 h-full">
                <div className="glass-card p-6 h-full overflow-y-auto">
                    <h3 className="text-sm font-bold text-[#222222] uppercase tracking-wider mb-6 pb-3 border-b border-[#EEEEEE]">
                        Shipment Progress
                    </h3>

                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-[#DDDDDD]" />

                        {checkpoints.map((checkpoint, index) => {
                            // Check if all checkpoints are completed (delivered status)
                            const allCompleted = checkpoints.every(cp => cp.completed);

                            // Only mark as current if not all completed
                            const isCurrent = !allCompleted && index === currentCheckpointIndex;
                            const isSelected = selectedCheckpoint === index;
                            const isActive = isSelected || (selectedCheckpoint === null && isCurrent);

                            return (
                                <div
                                    key={checkpoint.id}
                                    onClick={() => handleCheckpointClick(checkpoint)}
                                    className={`
                                        relative pl-10 pb-8 cursor-pointer transition-all
                                        ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-80'}
                                    `}
                                >
                                    {/* Status dot */}
                                    <div className={`
                                        absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-white
                                        flex items-center justify-center transition-all
                                        ${checkpoint.completed
                                            ? 'bg-emerald-500 shadow-md'
                                            : isCurrent
                                                ? 'bg-brand-500 shadow-md ring-4 ring-brand-100'
                                                : 'bg-[#E5E7EB]'
                                        }
                                        ${isActive ? 'scale-110' : 'scale-100'}
                                    `}>
                                        {checkpoint.completed && (
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className={`
                                        ${isActive ? 'bg-brand-50 border-brand-200' : 'bg-white border-[#EEEEEE]'}
                                        border rounded-lg p-3 transition-all
                                    `}>
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h4 className={`
                                                text-sm font-semibold leading-tight
                                                ${checkpoint.completed ? 'text-[#222222]' : 'text-[#777777]'}
                                            `}>
                                                {checkpoint.status}
                                            </h4>
                                            {isCurrent && !isSelected && (
                                                <span className="text-[10px] font-bold text-brand-600 bg-brand-100 px-2 py-0.5 rounded uppercase">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-[#555555] mb-1">{checkpoint.location}</p>
                                        <p className="text-[10px] text-[#999999] font-mono">{checkpoint.date}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Map - Right Side */}
            <div className="flex-1 relative h-full">
                <div className={`
                    glass-card overflow-hidden transition-all h-full
                    ${isFullScreen ? 'fixed inset-0 z-[9999] m-0 rounded-none' : 'rounded-xl'}
                `}>
                    <MapContainer
                        center={mapCenter || [20, 0]}
                        zoom={mapZoom}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                        zoomControl={true}
                    >
                        <MapController center={mapCenter} zoom={mapZoom} />
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                        />


                        {/* Single smooth route path with dotted style */}
                        {routeLine.length > 1 && routeLine.every(pos =>
                            Array.isArray(pos) &&
                            pos.length === 2 &&
                            Number.isFinite(pos[0]) &&
                            Number.isFinite(pos[1])
                        ) && (
                                <>
                                    {/* Full route - light gray dotted line */}
                                    <Polyline
                                        positions={routeLine}
                                        color="#D1D5DB"
                                        weight={3}
                                        opacity={0.5}
                                        dashArray="10, 10"
                                    />
                                    {/* Completed portion - purple dotted line */}
                                    <Polyline
                                        positions={routeLine.slice(0, currentCheckpointIndex + 1)}
                                        color="#4D148C"
                                        weight={3}
                                        opacity={0.9}
                                        dashArray="10, 10"
                                    />
                                </>
                            )}

                        {/* Checkpoint markers with hover tooltips */}
                        {checkpoints.map((checkpoint, index) => {
                            const allCompleted = checkpoints.every(cp => cp.completed);
                            const isCurrent = !allCompleted && index === currentCheckpointIndex;
                            const status = checkpoint.completed ? 'completed' : isCurrent ? 'current' : 'pending';

                            // Strict validation of coordinates
                            if (!checkpoint.coordinates ||
                                !Number.isFinite(checkpoint.coordinates.lat) ||
                                !Number.isFinite(checkpoint.coordinates.lng)) {
                                return null;
                            }

                            return (
                                <Marker
                                    key={checkpoint.id}
                                    position={[checkpoint.coordinates.lat, checkpoint.coordinates.lng]}
                                    icon={createCheckpointIcon(status)}
                                >
                                    <Popup>
                                        <div className="text-center min-w-[200px]">
                                            <h4 className="font-bold text-[#222222] mb-1">{checkpoint.status}</h4>
                                            <p className="text-sm text-[#555555] mb-1">{checkpoint.location}</p>
                                            <p className="text-xs text-[#999999] font-mono">{checkpoint.date}</p>
                                            {isCurrent && (
                                                <span className="inline-block mt-2 text-[10px] font-bold text-brand-600 bg-brand-100 px-2 py-1 rounded uppercase">
                                                    Current Location
                                                </span>
                                            )}
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}


                        {/* Active shipment position (animated) */}
                        {
                            shipmentPosition &&
                            Number.isFinite(shipmentPosition.lat) &&
                            Number.isFinite(shipmentPosition.lng) && (
                                <Marker
                                    key="shipment-plane"
                                    position={[shipmentPosition.lat, shipmentPosition.lng]}
                                    icon={shipmentIcon}
                                    zIndexOffset={1000}
                                />
                            )
                        }
                    </MapContainer>

                    {/* Map info overlay */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-xs border border-[#EEEEEE]">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-[#777777] uppercase tracking-wide mb-1">AWB {shipment.awb}</p>
                                <h4 className="text-sm font-bold text-[#222222] mb-1 truncate">
                                    {activeCheckpoint?.status}
                                </h4>
                                <p className="text-xs text-[#555555]">{activeCheckpoint?.location}</p>
                                {isAnimating && (
                                    <p className="text-[10px] text-brand-600 mt-1 font-semibold">● In Transit</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-[#EEEEEE]">
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-2">
                                <svg width="24" height="8" className="flex-shrink-0">
                                    <line x1="0" y1="4" x2="24" y2="4" stroke="#4D148C" strokeWidth="2" strokeDasharray="4,4" opacity="0.9" />
                                </svg>
                                <span className="text-[#555555]">Completed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg width="24" height="8" className="flex-shrink-0">
                                    <line x1="0" y1="4" x2="24" y2="4" stroke="#D1D5DB" strokeWidth="2" strokeDasharray="4,4" opacity="0.5" />
                                </svg>
                                <span className="text-[#555555]">Remaining</span>
                            </div>
                        </div>
                    </div>

                    {/* Fullscreen Toggle Button */}
                    <button
                        onClick={() => setIsFullScreen(!isFullScreen)}
                        className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 border-2 border-[#4D148C] hover:bg-brand-50 transition-colors z-[1000]"
                        title={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                        style={{ zIndex: 1000 }}
                    >
                        {isFullScreen ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4D148C" strokeWidth="2.5">
                                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4D148C" strokeWidth="2.5">
                                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShipmentTracker;
