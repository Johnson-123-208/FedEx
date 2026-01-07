import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/**
 * Animated route line component
 */
const AnimatedRoute = ({ positions, color = '#667eea', delay = 0 }) => {
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
        }, 100 + delay);

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
            weight={3}
            opacity={0.7}
            dashArray="10, 10"
        />
    ) : null;
};

/**
 * Shipment Tracking Map component
 * @param {Object} props - Component props
 * @param {Object} props.shipment - Shipment data with coordinates
 * @param {boolean} props.animated - Enable route animation
 */
const ShipmentMap = ({ shipment, animated = true }) => {
    if (!shipment || !shipment.coordinates) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 h-96 flex items-center justify-center">
                <p className="text-gray-500">No map data available</p>
            </div>
        );
    }

    const { origin, destination } = shipment.coordinates;
    const center = [
        (origin.lat + destination.lat) / 2,
        (origin.lng + destination.lng) / 2
    ];

    // Create curved route between origin and destination
    const createCurvedRoute = (start, end, numPoints = 50) => {
        const points = [];
        const latDiff = end.lat - start.lat;
        const lngDiff = end.lng - start.lng;

        // Calculate control point for curve (offset perpendicular to the line)
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

    // Custom icons
    const originIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const destinationIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
        >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Shipment Route</h3>
            <div className="h-96 rounded-lg overflow-hidden">
                <MapContainer
                    center={center}
                    zoom={3}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Origin Marker */}
                    <Marker position={[origin.lat, origin.lng]} icon={originIcon}>
                        <Popup>
                            <div className="text-center">
                                <p className="font-semibold">Origin</p>
                                <p className="text-sm">{shipment.origin}</p>
                            </div>
                        </Popup>
                    </Marker>

                    {/* Destination Marker */}
                    <Marker position={[destination.lat, destination.lng]} icon={destinationIcon}>
                        <Popup>
                            <div className="text-center">
                                <p className="font-semibold">Destination</p>
                                <p className="text-sm">{shipment.destination}</p>
                            </div>
                        </Popup>
                    </Marker>

                    {/* Animated Route */}
                    {animated ? (
                        <AnimatedRoute positions={routePoints} color="#667eea" />
                    ) : (
                        <Polyline
                            positions={routePoints}
                            color="#667eea"
                            weight={3}
                            opacity={0.7}
                            dashArray="10, 10"
                        />
                    )}
                </MapContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Origin: {shipment.origin}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Destination: {shipment.destination}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default ShipmentMap;
