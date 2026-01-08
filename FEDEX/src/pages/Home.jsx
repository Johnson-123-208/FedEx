import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
    const [stats, setStats] = useState({ deliveries: 0, rating: 0, success: 0 });

    // Animated counter effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setStats({ deliveries: 1402, rating: 4.9, success: 98.4 });
        }, 500);
        return () => clearTimeout(timer);
    }, []);

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
            description: 'Real-time visibility across 220+ countries and territories with AI-powered predictions.',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            title: 'Express Logistics',
            description: 'Premium expedited shipping for time-critical deliveries with guaranteed SLAs.',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            gradient: 'from-purple-500 to-pink-500'
        },
        {
            title: 'Secure Handling',
            description: 'Advanced protocols ensuring the safety of high-value cargo with 24/7 monitoring.',
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            gradient: 'from-emerald-500 to-teal-500'
        }
    ];

    const metrics = [
        { label: 'Countries Served', value: '220+', icon: '🌍' },
        { label: 'Daily Shipments', value: '50K+', icon: '📦' },
        { label: 'Partner Network', value: '1,200+', icon: '🤝' },
        { label: 'Uptime Guarantee', value: '99.9%', icon: '⚡' }
    ];

    return (
        <div className="min-h-screen">
            {/* HERO SECTION */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 z-0 bg-slate-950">
                    {/* Animated gradient orbs */}
                    <div className="absolute top-0 -left-4 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                    {/* Grid pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950"></div>
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
                            <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-brand-500/10 to-purple-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-8 backdrop-blur-sm">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
                                </span>
                                Next Generation Logistics
                            </motion.div>

                            <motion.h1 variants={item} className="text-5xl lg:text-7xl xl:text-8xl font-display font-bold text-white leading-[1.1] mb-6">
                                Delivering <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-purple-400 to-cyan-400 animate-gradient">Excellence</span> <br />
                                Worldwide.
                            </motion.h1>

                            <motion.p variants={item} className="text-lg lg:text-xl text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                Experience the future of supply chain management with our <span className="text-brand-400 font-semibold">AI-driven tracking</span> and premium delivery network.
                            </motion.p>

                            <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <Link to="/track" className="w-full sm:w-auto group">
                                    <button className="relative w-full sm:w-auto h-14 px-8 text-lg font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl overflow-hidden shadow-2xl shadow-brand-500/50 hover:shadow-brand-500/70 transition-all duration-300 hover:scale-105">
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Track Shipment
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </button>
                                </Link>
                                <Link to="/employee-dashboard" className="w-full sm:w-auto">
                                    <button className="w-full sm:w-auto h-14 px-8 text-lg font-semibold text-white bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:border-brand-500/50 transition-all duration-300">
                                        Employee Access
                                    </button>
                                </Link>
                            </motion.div>

                            {/* Trust Badges */}
                            <motion.div variants={item} className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-400">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    ISO Certified
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    24/7 Support
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Insured Cargo
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right Column: Visual */}
                        <motion.div
                            className="flex-1 relative w-full max-w-lg lg:max-w-none"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="relative z-10">
                                {/* Main Glass Card with 3D effect */}
                                <motion.div
                                    className="glass-card p-8 relative overflow-hidden group"
                                    whileHover={{ scale: 1.02, rotateY: 5 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    {/* Animated gradient background */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    <div className="absolute top-0 right-0 p-4 opacity-30">
                                        <svg className="w-32 h-32 text-brand-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
                                        </svg>
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">Live Statistics</h3>
                                        </div>

                                        <div className="text-6xl font-display font-bold text-white mb-2">
                                            {stats.deliveries.toLocaleString()}k
                                            <span className="text-brand-400 text-5xl">+</span>
                                        </div>
                                        <p className="text-slate-400 text-sm mb-6">Total Deliveries This Month</p>

                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="flex -space-x-3">
                                                {[1, 2, 3, 4].map(i => (
                                                    <motion.div
                                                        key={i}
                                                        className="w-12 h-12 rounded-full border-2 border-slate-900 bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center text-sm font-bold text-slate-300"
                                                        whileHover={{ scale: 1.2, zIndex: 10 }}
                                                    >
                                                        U{i}
                                                    </motion.div>
                                                ))}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1 mb-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <p className="text-sm text-slate-300">
                                                    <span className="text-white font-bold">{stats.rating}/5</span> Customer Rating
                                                </p>
                                            </div>
                                        </div>

                                        {/* Animated Progress Bar */}
                                        <div className="bg-slate-800/50 rounded-full h-3 overflow-hidden relative">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-brand-500 via-purple-500 to-brand-500 bg-[length:200%_100%]"
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: `${stats.success}%`,
                                                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                                                }}
                                                transition={{
                                                    width: { duration: 1.5, delay: 0.5 },
                                                    backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-400 mt-2">
                                            <span>Success Rate</span>
                                            <span className="text-brand-300 font-bold">{stats.success}%</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Floating Cards with enhanced animations */}
                                <motion.div
                                    className="absolute -top-12 -left-12 glass p-4 rounded-xl flex items-center gap-3 shadow-2xl"
                                    animate={{
                                        y: [0, 10, 0],
                                        rotate: [0, 2, 0]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/50">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium">Status</p>
                                        <p className="text-sm text-white font-bold">On Time</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="absolute -bottom-8 -right-8 glass p-4 rounded-xl flex items-center gap-3 shadow-2xl"
                                    animate={{
                                        y: [0, -10, 0],
                                        rotate: [0, -2, 0]
                                    }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/50">
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

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center p-2">
                        <motion.div
                            className="w-1 h-2 bg-brand-500 rounded-full"
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                </motion.div>
            </section>

            {/* METRICS SECTION */}
            <section className="bg-slate-900 py-16 relative overflow-hidden border-y border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {metrics.map((metric, idx) => (
                            <motion.div
                                key={idx}
                                className="text-center group cursor-pointer"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{metric.icon}</div>
                                <div className="text-3xl md:text-4xl font-display font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">{metric.value}</div>
                                <div className="text-sm text-slate-400">{metric.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="bg-slate-950 py-24 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500 rounded-full filter blur-3xl opacity-20"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                            Why Industry Leaders <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">Choose Us</span>
                        </h2>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">We combine global reach with local expertise to deliver logistics solutions that drive your business forward.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                className="group relative"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                whileHover={{ y: -8 }}
                            >
                                {/* Gradient border effect */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500`}></div>

                                <div className="relative p-8 rounded-2xl bg-slate-900 border border-slate-800 group-hover:border-transparent transition-all duration-300 h-full">
                                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3 font-display group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-brand-300 transition-all">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{feature.description}</p>

                                    {/* Hover arrow */}
                                    <div className="mt-6 flex items-center gap-2 text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-sm font-semibold">Learn more</span>
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
