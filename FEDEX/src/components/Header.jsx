import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Professional Navigation Header component
 */
const Header = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/track', label: 'Track Shipment' },
        { path: '/employee-dashboard', label: 'Employee' },
        { path: '/manager-dashboard', label: 'Manager' },
    ];

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="glass-dark sticky top-0 z-50 border-b border-white/10"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-md flex items-center justify-center text-white text-xl font-bold shadow-md">
                            A
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">
                                AADYAM LOGISTICS
                            </h1>
                            <p className="text-xs text-slate-400">Private Limited</p>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`
                                        px-4 py-2 rounded-md font-semibold text-sm transition-all
                                        ${location.pathname === item.path
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                                        }
                                    `}
                                >
                                    {item.label}
                                </motion.div>
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile menu button */}
                    <button className="md:hidden glass p-2 rounded-md text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="md:hidden pb-4 flex flex-wrap gap-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                        >
                            <div
                                className={`
                                    px-3 py-2 rounded-md text-sm font-semibold transition-all
                                    ${location.pathname === item.path
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                                    }
                                `}
                            >
                                {item.label}
                            </div>
                        </Link>
                    ))}
                </nav>
            </div>
        </motion.header>
    );
};

export default Header;
