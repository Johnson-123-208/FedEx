import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AnimatedRoute = ({ positions, color = '#3b82f6', delay = 0 }) => {
    const [visiblePositions, setVisiblePositions] = useState([]);
    const map = useMap();

    useEffect(() => {
        let currentIndex = 0;
        const timer = setInterval(() => {
            if (currentIndex < positions.length) {
                setVisiblePositions(positions.slice(0, currentIndex + 1));
                currentIndex++;
            } else {
                clearInterval(timer);
            }
        }, 80 + delay);

        return () => clearInterval(timer);
    }, [positions, delay]);

    useEffect(() => {
        if (visiblePositions.length > 0) {
            const bounds = L.latLngBounds(visiblePositions);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [visiblePositions, map]);

    return visiblePositions.length > 1 ? (
        <Polyline
            positions={visiblePositions}
            color={color}
            weight={4}
            opacity={0.8}
            dashArray="1, 0"
        />
    ) : null;
};

// Component to handle map resize events
const MapResizer = ({ isFullScreen }) => {
    const map = useMap();

    useEffect(() => {
        // Wait a small tick for the container to resize first
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 100);
        return () => clearTimeout(timer);
    }, [map, isFullScreen]);

    return null;
};

const ShipmentMap = ({ shipment, animated = true, isFullScreen = false }) => {
    // Check if shipment and coordinates exist
    if (!shipment || !shipment.coordinates) {
        return (
            <div className="glass-card flex items-center justify-center h-full min-h-[400px]">
                <p className="text-slate-500">No map data available</p>
            </div>
        );
    }

    const { origin, destination } = shipment.coordinates;

    // Check if origin and destination have valid coordinates
    if (!origin || !destination ||
        typeof origin.lat !== 'number' || typeof origin.lng !== 'number' ||
        typeof destination.lat !== 'number' || typeof destination.lng !== 'number') {
        return (
            <div className="glass-card flex items-center justify-center h-full min-h-[400px]">
                <p className="text-slate-500">No map data available</p>
            </div>
        );
    }
    const center = [
        (origin.lat + destination.lat) / 2,
        (origin.lng + destination.lng) / 2
    ];

    const createCurvedRoute = (start, end, numPoints = 60) => {
        const points = [];
        const latDiff = end.lat - start.lat;
        const lngDiff = end.lng - start.lng;
        // Curve calculation
        const midLat = (start.lat + end.lat) / 2;
        const midLng = (start.lng + end.lng) / 2;
        const offset = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 0.2;
        const controlLat = midLat + offset * Math.cos(Math.atan2(lngDiff, latDiff));
        const controlLng = midLng - offset * Math.sin(Math.atan2(lngDiff, latDiff));

        for (let i = 0; i <= numPoints; i++) {
            const t = i / numPoints;
            const lat = (1 - t) * (1 - t) * start.lat + 2 * (1 - t) * t * controlLat + t * t * end.lat;
            const lng = (1 - t) * (1 - t) * start.lng + 2 * (1 - t) * t * controlLng + t * t * end.lng;
            points.push([lat, lng]);
        }
        return points;
    };

    const routePoints = createCurvedRoute(origin, destination);

    const originIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const destinationIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    return (
        <div className="w-full h-full min-h-[400px] relative z-0">
            <MapContainer
                center={center}
                zoom={3}
                style={{ height: '100%', width: '100%', background: 'transparent' }}
                scrollWheelZoom={false}
                attributionControl={false}
            >
                <MapResizer isFullScreen={isFullScreen} />
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <Marker position={[origin.lat, origin.lng]} icon={originIcon}>
                    <Popup className="glass-popup">
                        <div className="text-center">
                            <p className="font-semibold text-slate-900">Origin</p>
                            <p className="text-xs text-slate-600">{shipment.origin}</p>
                        </div>
                    </Popup>
                </Marker>

                <Marker position={[destination.lat, destination.lng]} icon={destinationIcon}>
                    <Popup className="glass-popup">
                        <div className="text-center">
                            <p className="font-semibold text-slate-900">Destination</p>
                            <p className="text-xs text-slate-600">{shipment.destination}</p>
                        </div>
                    </Popup>
                </Marker>

                {animated ? (
                    <AnimatedRoute positions={routePoints} color="#3b82f6" />
                ) : (
                    <Polyline
                        positions={routePoints}
                        color="#3b82f6"
                        weight={4}
                        opacity={0.8}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default ShipmentMap;
