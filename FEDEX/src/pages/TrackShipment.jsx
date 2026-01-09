import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Timeline from '../components/Timeline';
import ShipmentMap from '../maps/ShipmentMap';
import StatusBadge from '../components/StatusBadge';

const PROVIDERS = ['FedEx', 'DHL', 'Atlantic', 'Courier Wala', 'ICL', 'PXC Pacific', 'United Express'];

const TrackShipment = () => {
    const [awbNumber, setAwbNumber] = useState('');
    const [selectedProvider, setSelectedProvider] = useState('FedEx');
    const [searchResult, setSearchResult] = useState(null);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState('');
    const [isFullScreen, setIsFullScreen] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');
        setSearching(true);
        setSearchResult(null);

        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            console.log(`Fetching ${selectedProvider} details for ${awbNumber}...`);
            const response = await fetch(`${apiUrl}/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ awb: awbNumber, provider: selectedProvider })
            });

            const data = await response.json();

            if (response.ok) {
                // Normalize timeline for the UI Component
                const normalizedTimeline = (data.timeline || []).map(t => ({
                    status: t.activity || t.status || 'Update',
                    date: t.date_time || t.date || t.time || '',
                    location: t.location || '',
                    completed: true
                }));

                setSearchResult({
                    ...data,
                    timeline: normalizedTimeline
                });
            } else {
                setError(data.error || 'Shipment not found or API error.');
            }
        } catch (err) {
            console.error("Tracking Error:", err);
            setError('Failed to connect to tracking server. Is app.py running?');
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto mb-10"
            >
                <h1 className="text-3xl font-display font-bold text-[#222222] mb-2 text-center">Track Your Shipment</h1>
                <p className="text-[#555555] text-center mb-8">Select your service provider and enter AWB to get real-time status.</p>

                {/* Search Bar */}
                <div className="glass-card p-2 flex items-center shadow-glow-sm max-w-2xl mx-auto gap-4">
                    <select
                        value={selectedProvider}
                        onChange={(e) => setSelectedProvider(e.target.value)}
                        className="bg-white text-[#222222] border-2 border-[#EEEEEE] rounded-md py-3 px-4 outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
                    >
                        {PROVIDERS.map((p) => (
                            <option key={p} value={p} className="bg-white text-[#222222]">
                                {p}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        value={awbNumber}
                        onChange={(e) => setAwbNumber(e.target.value)}
                        placeholder="e.g. 6002770480"
                        className="flex-1 bg-transparent border-none text-[#222222] placeholder-[#999999] px-2 py-3 focus:ring-0 text-lg font-mono outline-none w-full"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={searching || !awbNumber}
                        className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded-lg m-1 disabled:opacity-50 whitespace-nowrap font-semibold transition-all shadow-lg hover:shadow-accent-500/30"
                    >
                        {searching ? 'Tracking...' : 'Track'}
                    </button>
                </div>
                {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}

                {/* Sample Numbers Hint */}
                {!searchResult && (
                    <div className="mt-4 text-center text-xs text-slate-600">
                        Try <b>ICL</b>: 6002770480, <b>FedEx</b>: 885670900649
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
                                    <p className="text-white font-semibold">{searchResult.origin || '-'}</p>
                                </div>

                                {/* Destination */}
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">To</p>
                                    <p className="text-white font-semibold">{searchResult.destination || '-'}</p>
                                </div>

                                {/* Weight */}
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Weight</p>
                                    <p className="text-white font-mono">{searchResult.weight || '-'} kg</p>
                                </div>

                                {/* Est. Delivery */}
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Est. Delivery</p>
                                    <p className="text-brand-300 font-semibold">{searchResult.estimatedDelivery || '-'}</p>
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
                                        <ShipmentMap
                                            shipment={searchResult}
                                            animated={true}
                                            isFullScreen={isFullScreen}
                                        />
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
