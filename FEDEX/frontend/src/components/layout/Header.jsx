import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/track', label: 'Track Shipment' },
        { path: '/providers', label: 'Service Providers' },
    ];

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 left-0 right-0 z-50 bg-brand-500 shadow-md py-4"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link to="/" className="group flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-brand-500 rounded-lg opacity-20 group-hover:opacity-40 blur transition duration-200"></div>
                                <div className="relative w-10 h-10 bg-white rounded-lg flex items-center justify-center text-brand-500 font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
                                    A
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-display font-bold text-lg text-white leading-none tracking-tight group-hover:text-brand-100 transition-colors">
                                    AADYAM
                                </span>
                                <span className="text-[10px] uppercase tracking-[0.2em] text-white/80 group-hover:text-white transition-colors">
                                    Logistics
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link key={item.path} to={item.path}>
                                        <div className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'text-white bg-white/20' : 'text-white/90 hover:text-white hover:bg-white/10'
                                            }`}>
                                            {item.label}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="navbar-indicator"
                                                    className="absolute inset-0 bg-white/20 rounded-lg border border-white/10"
                                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                />
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}

                            {/* Login Button */}
                            <div className="ml-2 pl-2 border-l border-white/20">
                                <Link to="/login">
                                    <div className="px-6 py-2 rounded-lg text-sm font-bold bg-white text-brand-600 hover:bg-brand-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 whitespace-nowrap">
                                        Dashboard Login
                                    </div>
                                </Link>
                            </div>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-white hover:text-white/80"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-[280px] z-[61] bg-slate-900 border-l border-white/10 p-6 md:hidden shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <span className="font-display font-bold text-xl text-white">Menu</span>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-lg"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <nav className="flex flex-col gap-2">
                                {navItems.map((item, idx) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <motion.div
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className={`p-3 rounded-lg text-sm font-semibold ${location.pathname === item.path
                                                ? 'bg-brand-600/20 text-brand-300 border border-brand-500/20'
                                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {item.label}
                                        </motion.div>
                                    </Link>
                                ))}

                                <div className="h-px bg-white/10 my-2"></div>

                                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <motion.div
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="p-3 rounded-lg text-sm font-bold bg-white text-brand-900 text-center"
                                    >
                                        Dashboard Login
                                    </motion.div>
                                </Link>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
