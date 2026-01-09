import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShipmentTracker from '../components/ShipmentTracker';
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
            // Priority: Env Var > Hardcoded Production > Localhost fallback
            // NOTE: Please verify this URL matches your Render deployment exactly
            const prodUrl = 'https://fedex-3oal.onrender.com';

            const apiUrl = process.env.REACT_APP_API_URL ||
                (window.location.hostname === 'localhost'
                    ? 'http://localhost:5000'
                    : prodUrl);

            console.log(`API URL: ${apiUrl}`);
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
            console.error("Tracking Error Detailed:", err);
            setError(`Failed to connect to tracking server (${window.location.hostname === 'localhost' ? 'Local' : 'Remote'}). Is the backend running?`);
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
                                        <p className="text-xl font-display font-bold text-[#222222]">{searchResult.awb}</p>
                                    </div>
                                    <StatusBadge status={searchResult.status} size="md" />
                                </div>

                                {/* Service */}
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Service</p>
                                    <p className="text-[#222222] font-semibold">{searchResult.service}</p>
                                </div>

                                {/* Origin */}
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">From</p>
                                    <p className="text-[#222222] font-semibold">{searchResult.origin || '-'}</p>
                                </div>

                                {/* Destination */}
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">To</p>
                                    <p className="text-[#222222] font-semibold">{searchResult.destination || '-'}</p>
                                </div>

                                {/* Weight */}
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Weight</p>
                                    <p className="text-[#222222] font-mono">{searchResult.weight || '-'} kg</p>
                                </div>

                                {/* Est. Delivery */}
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Est. Delivery</p>
                                    <p className="text-brand-600 font-semibold">{searchResult.estimatedDelivery || '-'}</p>
                                </div>
                            </div>
                        </div>


                        {/* INTEGRATED TRACKING SYSTEM */}
                        <ShipmentTracker
                            shipment={searchResult}
                            isFullScreen={isFullScreen}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TrackShipment;
