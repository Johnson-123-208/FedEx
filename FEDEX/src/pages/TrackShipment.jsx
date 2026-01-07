import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Timeline from '../components/Timeline';
import ShipmentMap from '../maps/ShipmentMap';
import StatusBadge from '../components/StatusBadge';
import { shipments } from '../data/mockData';

const TrackShipment = () => {
    const [awbNumber, setAwbNumber] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState('');
    const [isFullScreen, setIsFullScreen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        setError('');
        setSearching(true);
        setSearchResult(null);

        setTimeout(() => {
            const result = shipments.find(
                (shipment) => shipment.awb.toLowerCase() === awbNumber.toLowerCase()
            );

            if (result) {
                setSearchResult(result);
            } else {
                setError('Shipment not found. Please verify the AWB number.');
            }
            setSearching(false);
        }, 800);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto mb-10"
            >
                <h1 className="text-3xl font-display font-bold text-white mb-2 text-center">Track Your Shipment</h1>
                <p className="text-slate-400 text-center mb-8">Enter your AWB number to get real-time status updates.</p>

                {/* Search Bar */}
                <div className="glass-card p-2 flex items-center shadow-glow-sm max-w-2xl mx-auto">
                    <input
                        type="text"
                        value={awbNumber}
                        onChange={(e) => setAwbNumber(e.target.value)}
                        placeholder="e.g. 6002770480"
                        className="flex-1 bg-transparent border-none text-white placeholder-slate-500 px-6 py-3 focus:ring-0 text-lg font-mono outline-none w-full"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={searching || !awbNumber}
                        className="btn-primary px-8 py-3 rounded-lg m-1 disabled:opacity-50"
                    >
                        {searching ? 'Searching...' : 'Track'}
                    </button>
                </div>
                {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}

                {/* Sample Numbers */}
                {!searchResult && (
                    <div className="mt-4 flex justify-center gap-4 text-sm text-slate-500">
                        <span>Sample AWB:</span>
                        {shipments.slice(0, 3).map((s) => (
                            <button
                                key={s.awb}
                                onClick={() => setAwbNumber(s.awb)}
                                className="text-brand-400 hover:text-brand-300 hover:underline"
                            >
                                {s.awb}
                            </button>
                        ))}
                    </div>
                )}
            </motion.div>

            <AnimatePresence>
                {searchResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        {/* SINGLE LINE DETAILS */}
                        <div className="glass-card p-6 mb-6">
                            <div className="flex flex-wrap items-center justify-between gap-6">
                                {/* AWB & Status */}
                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">AWB Number</p>
                                        <p className="text-xl font-display font-bold text-white">{searchResult.awb}</p>
                                    </div>
                                    <StatusBadge status={searchResult.status} size="md" />
                                </div>

                                {/* Service */}
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Service</p>
                                    <p className="text-white font-semibold">{searchResult.service}</p>
                                </div>

                                {/* Origin */}
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">From</p>
                                    <p className="text-white font-semibold">{searchResult.origin}</p>
                                </div>

                                {/* Destination */}
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">To</p>
                                    <p className="text-white font-semibold">{searchResult.destination}</p>
                                </div>

                                {/* Weight */}
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Weight</p>
                                    <p className="text-white font-mono">{searchResult.weight} kg</p>
                                </div>

                                {/* Est. Delivery */}
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Est. Delivery</p>
                                    <p className="text-brand-300 font-semibold">{searchResult.estimatedDelivery}</p>
                                </div>
                            </div>
                        </div>

                        {/* MAP & TIMELINE GRID */}
                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Timeline Column */}
                            <div className="lg:col-span-1">
                                <div className="glass-card p-6 h-[600px] overflow-y-auto custom-scrollbar">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 sticky top-0 bg-slate-900/95 backdrop-blur-sm pb-2 -mx-6 px-6">
                                        Tracking History
                                    </h3>
                                    <Timeline timeline={searchResult.timeline} />
                                </div>
                            </div>

                            {/* Map Column */}
                            <div className="lg:col-span-2 relative">
                                <div className={`
                                    glass-card p-0 border-0 overflow-hidden transition-all duration-300
                                    ${isFullScreen ? 'fixed inset-0 z-[9999] m-0 rounded-none' : 'rounded-2xl h-[600px]'}
                                `}>
                                    {/* Full Screen Toggle Button */}
                                    <button
                                        onClick={() => setIsFullScreen(!isFullScreen)}
                                        className="absolute top-4 right-4 z-[10000] bg-slate-900/90 hover:bg-white text-white hover:text-slate-900 p-3 rounded-lg backdrop-blur-md border border-white/10 shadow-xl transition-all group"
                                        title={isFullScreen ? "Exit Full Screen" : "View Full Screen"}
                                    >
                                        {isFullScreen ? (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                            </svg>
                                        )}
                                    </button>

                                    {/* Map Container */}
                                    <div className="w-full h-full bg-slate-900">
                                        <ShipmentMap shipment={searchResult} animated={true} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TrackShipment;
