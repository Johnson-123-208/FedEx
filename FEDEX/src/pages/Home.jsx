import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* HERO SECTION - FedEx Style */}
            <section
                className="relative h-[600px] flex items-end justify-center overflow-hidden pb-20"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/image.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="container mx-auto px-4 relative z-10">
                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-8 tracking-tight"
                    >
                        Ship, manage, track, deliver
                    </motion.h1>

                    {/* Action Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col md:flex-row gap-0 max-w-3xl mx-auto mb-6"
                    >
                        {/* Rate & Ship Card */}
                        <Link to="/track" className="flex-1 bg-white p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition-all group border-r border-gray-200">
                            <svg className="w-10 h-10 mb-2 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Rate & Ship</span>
                        </Link>

                        {/* Track Card - Purple */}
                        <Link to="/track" className="flex-1 bg-brand-500 p-6 flex flex-col items-center justify-center hover:bg-brand-600 transition-all group">
                            <svg className="w-10 h-10 mb-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="text-xs font-bold text-white uppercase tracking-wider">Track</span>
                        </Link>

                        {/* Locations Card */}
                        <Link to="/track" className="flex-1 bg-white p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition-all group border-l border-gray-200">
                            <svg className="w-10 h-10 mb-2 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Locations</span>
                        </Link>
                    </motion.div>

                    {/* Tracking Input */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="max-w-2xl mx-auto flex gap-0 shadow-2xl"
                    >
                        <input
                            type="text"
                            placeholder="TRACKING ID"
                            className="flex-1 px-6 py-3 text-gray-700 placeholder-gray-400 focus:outline-none text-base"
                        />
                        <button className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 font-bold text-base uppercase tracking-wider transition-all flex items-center gap-2">
                            Track
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Why Choose Aadyam Logistics
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Experience world-class logistics solutions with cutting-edge technology and unmatched reliability.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Feature 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all hover:border-brand-500"
                        >
                            <div className="w-16 h-16 bg-brand-500 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Global Network</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Reach over 220 countries and territories with our extensive logistics network.
                            </p>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all hover:border-accent-500"
                        >
                            <div className="w-16 h-16 bg-accent-500 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Express Delivery</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Time-critical shipments delivered with guaranteed speed and reliability.
                            </p>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all hover:border-brand-500"
                        >
                            <div className="w-16 h-16 bg-emerald-500 rounded-lg flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Secure Handling</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Advanced security protocols ensure your shipments are safe every step of the way.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* STATS SECTION */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-brand-500 mb-2">220+</div>
                            <div className="text-gray-600 font-medium">Countries Served</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold text-accent-500 mb-2">50K+</div>
                            <div className="text-gray-600 font-medium">Daily Shipments</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold text-brand-500 mb-2">1,200+</div>
                            <div className="text-gray-600 font-medium">Partner Network</div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl font-bold text-emerald-500 mb-2">99.9%</div>
                            <div className="text-gray-600 font-medium">Uptime</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
