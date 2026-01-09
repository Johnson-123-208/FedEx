import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ShipmentTracker from '../components/ShipmentTracker';
import StatusBadge from '../components/StatusBadge';

const PROVIDERS = ['FedEx', 'DHL', 'Atlantic', 'Courier Wala', 'ICL', 'PXC Pacific', 'United Express'];

const TrackShipment = () => {
    const location = useLocation();
    const [awbNumber, setAwbNumber] = useState('');
    const [selectedProvider, setSelectedProvider] = useState(location.state?.provider || 'FedEx');
    const [searchResult, setSearchResult] = useState(null);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState('');
    const [isFullScreen] = useState(false);

    useEffect(() => {
        if (location.state?.provider) {
            setSelectedProvider(location.state.provider);
        }
    }, [location.state]);

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');
        setSearching(true);
        setSearchResult(null);

        try {
            // Priority: Env Var > Hardcoded Production
            const prodUrl = 'https://fedex-backend-t4su.onrender.com';

            const apiUrl = process.env.REACT_APP_API_URL || prodUrl;

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
        <div className="min-h-screen bg-slate-50">
            {/* HERO SECTION */}
            <div className="relative bg-slate-900 pb-32 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-slate-900 to-black opacity-90"></div>

                {/* World Map Decoration (Optional CSS art or SVG) */}
                <div className="absolute top-0 right-0 p-20 opacity-10 transform translate-x-1/3 -translate-y-1/4">
                    <svg width="800" height="800" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#FFFFFF" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-4.9C93.5,9.3,82.3,22.9,71.2,34.2C60.1,45.5,49.1,54.5,37.1,61.7C25.1,68.9,12.1,74.3,-0.6,75.3C-13.3,76.3,-26,72.9,-37.9,65.9C-49.8,58.9,-60.9,48.3,-69.6,36.2C-78.3,24.1,-84.6,10.6,-83.4,-2.4C-82.2,-15.4,-73.5,-27.9,-63.3,-38.3C-53.1,-48.7,-41.4,-57,-29.4,-65.4C-17.4,-73.8,-5.1,-82.3,8,-96.2L44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">
                            Track Your <span className="text-brand-400">Shipment</span>
                        </h1>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                            Real-time global tracking across 7+ premium carriers. <br className="hidden md:block" />
                            Enter your AWB number below to get instant status updates.
                        </p>

                        {/* Search Bar - Floating */}
                        <div className="bg-white p-2 rounded-2xl shadow-2xl shadow-brand-900/20 max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-2 transform translate-y-8">
                            <div className="w-full md:w-auto relative border-b md:border-b-0 md:border-r border-slate-200">
                                <select
                                    value={selectedProvider}
                                    onChange={(e) => setSelectedProvider(e.target.value)}
                                    className="w-full md:w-48 appearance-none bg-transparent text-slate-800 font-bold py-4 px-6 outline-none cursor-pointer hover:bg-slate-50 transition-colors rounded-xl"
                                >
                                    {PROVIDERS.map((p) => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>

                            <div className="flex-1 w-full relative">
                                <input
                                    type="text"
                                    value={awbNumber}
                                    onChange={(e) => setAwbNumber(e.target.value)}
                                    placeholder="Enter Tracking Number"
                                    className="w-full bg-transparent text-slate-900 placeholder-slate-400 font-mono text-lg px-6 py-4 outline-none"
                                />
                            </div>

                            <button
                                onClick={handleSearch}
                                disabled={searching || !awbNumber}
                                className="w-full md:w-auto bg-brand-600 hover:bg-brand-700 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-brand-600/30 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                {searching ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Searching...
                                    </span>
                                ) : 'Track Now'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* MAIN CONTENT CONTAINER */}
            <div className="container mx-auto px-4 mt-24 mb-20 relative z-0">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-100 text-center mb-8 shadow-sm flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </motion.div>
                )}

                {/* Empty State Features */}
                {!searchResult && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-6xl mx-auto"
                    >
                        {/* Sample Numbers */}
                        <div className="text-center mb-16">
                            <span className="inline-block bg-white px-4 py-2 rounded-full text-sm text-slate-500 border border-slate-200 shadow-sm">
                                Feature Preview: Try <b>ICL</b> <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-brand-700">6002770480</span> or <b>FedEx</b> <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-brand-700">885670900649</span>
                            </span>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="p-8 bg-white rounded-2xl border border-slate-100 hover:shadow-xl transition-all group"
                            >
                                <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-500 transition-colors">
                                    <svg className="w-7 h-7 text-brand-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="font-display font-bold text-slate-800 text-lg mb-3">Lightning Fast Updates</h3>
                                <p className="text-slate-500 leading-relaxed">Direct integration with 7+ global carriers ensures you get the status as soon as it's available in the system.</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="p-8 bg-white rounded-2xl border border-slate-100 hover:shadow-xl transition-all group"
                            >
                                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
                                    <svg className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="font-display font-bold text-slate-800 text-lg mb-3">Secure & Private</h3>
                                <p className="text-slate-500 leading-relaxed">Your tracking data is encrypted and handled with the utmost privacy. We never share your shipping details.</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="p-8 bg-white rounded-2xl border border-slate-100 hover:shadow-xl transition-all group"
                            >
                                <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition-colors">
                                    <svg className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-display font-bold text-slate-800 text-lg mb-3">Global Network</h3>
                                <p className="text-slate-500 leading-relaxed">From local couriers to international freight, track shipments across 220+ countries and territories.</p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

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
        </div>
    );
};

export default TrackShipment;
