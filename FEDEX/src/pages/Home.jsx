import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
    // Stagger children animation
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const features = [
        {
            title: 'Global Tracking',
            description: 'Real-time visibility across 220+ countries and territories.',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            title: 'Express Logistics',
            description: 'Premium expedited shipping for time-critical deliveries.',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        },
        {
            title: 'Secure Handling',
            description: 'Advanced protocols ensuring the safety of high-value cargo.',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen">
            {/* HERO SECTION */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Background Grid & Gradient */}
                <div className="absolute inset-0 z-0 bg-slate-950">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-brand-900/20 via-transparent to-transparent opacity-60"></div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 relative z-10 pt-20">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                        {/* Left Column: Text */}
                        <motion.div
                            className="flex-1 text-center lg:text-left"
                            initial="hidden"
                            animate="show"
                            variants={container}
                        >
                            <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-8">
                                <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
                                Next Generation Logistics
                            </motion.div>

                            <motion.h1 variants={item} className="text-5xl lg:text-7xl font-display font-bold text-white leading-[1.1] mb-6">
                                Delivering <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-100">Excellence</span> <br />
                                Worldwide.
                            </motion.h1>

                            <motion.p variants={item} className="text-lg text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                Experience the future of supply chain management with our AI-driven tracking and premium delivery network.
                            </motion.p>

                            <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <Link to="/track" className="w-full sm:w-auto">
                                    <button className="btn-primary w-full sm:w-auto h-14 text-lg shadow-glow">
                                        Track Shipment
                                        <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </button>
                                </Link>
                                <Link to="/employee-dashboard" className="w-full sm:w-auto">
                                    <button className="btn-secondary w-full sm:w-auto h-14 text-lg">
                                        Employee Access
                                    </button>
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Right Column: Visual */}
                        <motion.div
                            className="flex-1 relative w-full max-w-lg lg:max-w-none"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="relative z-10">
                                {/* Glass Card - Main Stats */}
                                <div className="glass-card p-8 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                                    <div className="absolute top-0 right-0 p-4 opacity-50">
                                        <svg className="w-24 h-24 text-brand-500/10" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
                                        </svg>
                                    </div>

                                    <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Total Deliveries</h3>
                                    <div className="text-5xl font-display font-bold text-white mb-4">1,402k<span className="text-brand-400 text-4xl">+</span></div>

                                    <div className="flex items-center gap-4 mt-8">
                                        <div className="flex -space-x-3">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs text-slate-400">U{i}</div>
                                            ))}
                                        </div>
                                        <div className="text-sm text-slate-300">
                                            <span className="text-white font-bold">4.9/5</span> Customer Rating
                                        </div>
                                    </div>

                                    {/* Animated Progress Bar */}
                                    <div className="mt-8 bg-slate-800/50 rounded-full h-2 overflow-hidden">
                                        <motion.div
                                            className="h-full bg-brand-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: '94%' }}
                                            transition={{ duration: 1.5, delay: 0.5 }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-400 mt-2">
                                        <span>Success Rate</span>
                                        <span className="text-brand-300">98.4%</span>
                                    </div>
                                </div>

                                {/* Floating Card 1 */}
                                <motion.div
                                    className="absolute -top-12 -left-12 glass p-4 rounded-xl flex items-center gap-3 animate-float"
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium">Status</p>
                                        <p className="text-sm text-white font-bold">On Time</p>
                                    </div>
                                </motion.div>

                                {/* Floating Card 2 */}
                                <motion.div
                                    className="absolute -bottom-8 -right-8 glass p-4 rounded-xl flex items-center gap-3"
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                >
                                    <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium">Speed</p>
                                        <p className="text-sm text-white font-bold">Express</p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="bg-slate-900 py-24 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Why Industry Leaders Choose Us</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">We combine global reach with local expertise to deliver logistics solutions that drive your business forward.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <div key={idx} className="group p-8 rounded-2xl bg-slate-950 border border-white/5 hover:border-brand-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-1">
                                <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center text-brand-500 mb-6 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 font-display">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
