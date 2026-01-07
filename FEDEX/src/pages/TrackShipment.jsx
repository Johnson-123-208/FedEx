import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Timeline from '../components/Timeline';
import ShipmentMap from '../maps/ShipmentMap';
import StatusBadge from '../components/StatusBadge';
import { shipments } from '../data/mockData';

/**
 * Track Shipment Page - Professional shipment tracking interface
 */
const TrackShipment = () => {
    const [awbNumber, setAwbNumber] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        setError('');
        setSearching(true);

        // Simulate API call delay
        setTimeout(() => {
            const result = shipments.find(
                (shipment) => shipment.awb.toLowerCase() === awbNumber.toLowerCase()
            );

            if (result) {
                setSearchResult(result);
                setError('');
            } else {
                setSearchResult(null);
                setError('Shipment not found. Please verify the AWB number and try again.');
            }
            setSearching(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Search Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-lg shadow-md p-8 mb-8 border border-slate-200"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-slate-900 mb-3">
                            Track Your Shipment
                        </h1>
                        <p className="text-lg text-slate-600">
                            Enter your AWB (Air Waybill) number to track your package
                        </p>
                    </div>

                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={awbNumber}
                                onChange={(e) => setAwbNumber(e.target.value)}
                                placeholder="Enter AWB Number (e.g., 6002770480)"
                                className="flex-1 px-4 py-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all"
                                required
                            />
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={searching}
                                className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {searching ? (
                                    <div className="flex items-center gap-2">
                                        <div className="spinner w-5 h-5 border-2"></div>
                                        <span>Searching...</span>
                                    </div>
                                ) : (
                                    'Track'
                                )}
                            </motion.button>
                        </div>
                    </form>

                    {/* Sample AWB Numbers */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-500 mb-3 font-medium">Sample AWB numbers:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {shipments.slice(0, 5).map((shipment) => (
                                <button
                                    key={shipment.awb}
                                    onClick={() => setAwbNumber(shipment.awb)}
                                    className="px-3 py-1 bg-slate-100 hover:bg-blue-50 rounded-md text-sm text-slate-700 hover:text-blue-700 transition-colors border border-slate-200"
                                >
                                    {shipment.awb}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-center"
                        >
                            <p className="font-semibold">{error}</p>
                        </motion.div>
                    )}
                </motion.div>

                {/* Results Section */}
                {searchResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Shipment Details Card */}
                        <div className="bg-white rounded-lg shadow-md p-8 mb-8 border border-slate-200">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                        Shipment Details
                                    </h2>
                                    <p className="text-slate-600">AWB: <span className="font-semibold text-blue-600">{searchResult.awb}</span></p>
                                </div>
                                <StatusBadge status={searchResult.status} size="lg" />
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-slate-50 rounded-md p-4 border border-slate-200">
                                    <p className="text-xs text-slate-500 mb-1 font-semibold uppercase">Service</p>
                                    <p className="font-bold text-lg text-slate-900">{searchResult.service}</p>
                                </div>
                                <div className="bg-slate-50 rounded-md p-4 border border-slate-200">
                                    <p className="text-xs text-slate-500 mb-1 font-semibold uppercase">Weight</p>
                                    <p className="font-bold text-lg text-slate-900">{searchResult.weight} kg</p>
                                </div>
                                <div className="bg-slate-50 rounded-md p-4 border border-slate-200">
                                    <p className="text-xs text-slate-500 mb-1 font-semibold uppercase">Contents</p>
                                    <p className="font-bold text-lg text-slate-900">{searchResult.contents}</p>
                                </div>
                                <div className="bg-slate-50 rounded-md p-4 border border-slate-200">
                                    <p className="text-xs text-slate-500 mb-1 font-semibold uppercase">Est. Delivery</p>
                                    <p className="font-bold text-lg text-slate-900">{searchResult.estimatedDelivery}</p>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-slate-50 rounded-md p-4 border border-slate-200">
                                        <p className="text-xs text-slate-500 mb-2 font-semibold uppercase">From</p>
                                        <p className="font-bold text-lg text-slate-900 mb-1">{searchResult.sender}</p>
                                        <p className="text-slate-600 text-sm">{searchResult.origin}</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-md p-4 border border-slate-200">
                                        <p className="text-xs text-slate-500 mb-2 font-semibold uppercase">To</p>
                                        <p className="font-bold text-lg text-slate-900 mb-1">{searchResult.receiver}</p>
                                        <p className="text-slate-600 text-sm">{searchResult.destination}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map and Timeline */}
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Map */}
                            <div>
                                <ShipmentMap shipment={searchResult} animated={true} />
                            </div>

                            {/* Timeline */}
                            <div className="bg-white rounded-lg shadow-md p-8 border border-slate-200">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                                    Tracking Timeline
                                </h3>
                                <Timeline timeline={searchResult.timeline} />
                            </div>
                        </div>

                        {/* Current Location Banner */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md p-8 text-white"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold opacity-90 mb-1 uppercase tracking-wide">Current Location</p>
                                    <h3 className="text-3xl font-bold">{searchResult.currentLocation}</h3>
                                </div>
                                <div className="text-5xl opacity-80">📍</div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Empty State */}
                {!searchResult && !error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="text-center py-20"
                    >
                        <div className="text-6xl mb-6 opacity-20">🔍</div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">
                            Ready to Track Your Shipment?
                        </h3>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Enter your AWB number above to get real-time tracking information,
                            delivery status, and estimated arrival time.
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default TrackShipment;
