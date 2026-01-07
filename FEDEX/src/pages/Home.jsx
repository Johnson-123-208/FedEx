import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header';

/**
 * Home Page - Professional landing page for the logistics platform
 */
const Home = () => {
    const features = [
        {
            title: 'Real-Time Tracking',
            description: 'Monitor your shipments with live updates and comprehensive tracking information',
            color: 'from-blue-600 to-blue-700'
        },
        {
            title: 'Global Network',
            description: 'Extensive coverage across 200+ countries with reliable delivery partners',
            color: 'from-slate-600 to-slate-700'
        },
        {
            title: 'Express Delivery',
            description: 'Fast and efficient delivery options with guaranteed on-time arrival',
            color: 'from-sky-600 to-sky-700'
        },
        {
            title: 'Secure Handling',
            description: 'Advanced security measures ensuring safe transport of your packages',
            color: 'from-indigo-600 to-indigo-700'
        },
        {
            title: 'Analytics Dashboard',
            description: 'Comprehensive insights and reporting for informed decision-making',
            color: 'from-blue-700 to-blue-800'
        },
        {
            title: 'Enterprise Solutions',
            description: 'Tailored logistics solutions designed for businesses of all sizes',
            color: 'from-slate-700 to-slate-800'
        }
    ];

    const stats = [
        { value: '1M+', label: 'Shipments Delivered' },
        { value: '200+', label: 'Countries Served' },
        { value: '98%', label: 'On-Time Delivery' },
        { value: '24/7', label: 'Customer Support' }
    ];

    return (
        <div className="min-h-screen relative">
            <Header />

            {/* Hero Section */}
            <section className="relative overflow-hidden min-h-screen flex items-center">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: 'url(/hero-bg.png)' }}
                    />
                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-blue-950/95" />
                    {/* Animated Gradient Accent */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-orange-500/10" />
                </div>

                {/* Floating Particles Effect */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.2, 0.5, 0.2],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        />
                    ))}
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-32">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            {/* Badge */}
                            <motion.div
                                className="inline-block mb-6"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <span className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-orange-500/20 backdrop-blur-sm border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
                                    ✦ Enterprise Logistics Platform
                                </span>
                            </motion.div>

                            {/* Main Heading - Reduced Size */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                                    AADYAM LOGISTICS
                                </span>
                                <span className="block text-xl md:text-2xl font-medium text-slate-400 mt-3">
                                    Private Limited
                                </span>
                            </h1>

                            {/* Description - Reduced Size */}
                            <p className="text-base md:text-lg text-slate-300 mb-8 leading-relaxed max-w-xl">
                                Your trusted partner for fast, reliable, and secure logistics solutions worldwide.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4 mb-12">
                                <Link to="/track">
                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)" }}
                                        whileTap={{ scale: 0.95 }}
                                        className="group relative px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold overflow-hidden shadow-lg shadow-blue-500/30 text-sm"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            Track Shipment
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.button>
                                </Link>
                                <Link to="/employee-dashboard">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold border border-white/20 hover:bg-white/20 transition-all text-sm"
                                    >
                                        Access Dashboard
                                    </motion.button>
                                </Link>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-6">
                                {[
                                    { value: '200+', label: 'Countries' },
                                    { value: '1M+', label: 'Deliveries' },
                                    { value: '24/7', label: 'Support' }
                                ].map((stat, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + idx * 0.1 }}
                                        className="text-center"
                                    >
                                        <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                                            {stat.value}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
                                            {stat.label}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right Content - Glassmorphism Cards */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="relative hidden lg:block"
                        >
                            {/* Main Stats Card */}
                            <div className="relative">
                                <motion.div
                                    className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10 shadow-2xl"
                                    whileHover={{ y: -5 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Delivery Rate */}
                                    <div className="bg-gradient-to-br from-blue-600/90 to-blue-800/90 backdrop-blur-sm rounded-xl p-8 text-white text-center mb-6 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
                                        <div className="relative z-10">
                                            <div className="text-5xl font-bold mb-2">94.5%</div>
                                            <div className="text-xs font-semibold uppercase tracking-widest opacity-90">On-Time Delivery</div>
                                        </div>
                                    </div>

                                    {/* Mini Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-5 text-center border border-white/5">
                                            <p className="text-3xl font-bold text-white mb-1">4.2</p>
                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Avg Days</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-5 text-center border border-white/5">
                                            <p className="text-3xl font-bold text-white mb-1">98%</p>
                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Success</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Floating Badge */}
                                <motion.div
                                    className="absolute -top-4 -right-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full shadow-lg shadow-orange-500/50 text-xs font-bold"
                                    animate={{
                                        rotate: [0, 5, 0, -5, 0],
                                        y: [0, -5, 0]
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    ⚡ LIVE
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom Gradient Fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent z-10" />
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="text-center text-white"
                            >
                                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                                <div className="text-sm font-semibold opacity-90 uppercase tracking-wider">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">
                            Why Choose AADYAM LOGISTICS
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Comprehensive logistics solutions with cutting-edge technology
                            and professional service excellence.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="bg-white rounded-lg shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow"
                            >
                                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg mb-4`}></div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-slate-300 mb-10">
                            Join thousands of businesses who trust AADYAM LOGISTICS
                            for their shipping and logistics needs.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link to="/track">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-white text-blue-600 px-8 py-4 rounded-md font-semibold hover:bg-slate-50 transition-colors shadow-lg"
                                >
                                    Track Your Shipment
                                </motion.button>
                            </Link>
                            <Link to="/employee-dashboard">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn-secondary px-8 py-4"
                                >
                                    Access Dashboard
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="glass-dark border-t border-white/10 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">AADYAM LOGISTICS</h3>
                            <p className="text-slate-400 text-sm">Private Limited</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                                <li><Link to="/track" className="hover:text-white transition-colors">Track Shipment</Link></li>
                                <li><Link to="/employee-dashboard" className="hover:text-white transition-colors">Employee Dashboard</Link></li>
                                <li><Link to="/manager-dashboard" className="hover:text-white transition-colors">Manager Dashboard</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Services</h4>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                <li>Express Delivery</li>
                                <li>International Shipping</li>
                                <li>Warehousing</li>
                                <li>Supply Chain Management</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Contact</h4>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                <li>info@aadyamlogistics.com</li>
                                <li>+91 1800-XXX-XXXX</li>
                                <li>India</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/10 mt-8 pt-8 text-center">
                        <p className="text-slate-400 text-sm">
                            &copy; 2025 AADYAM LOGISTICS PRIVATE LIMITED. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
