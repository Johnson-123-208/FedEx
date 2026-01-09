import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="relative bg-[#0B1120] border-t border-white/10 pt-16 pb-8 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div>
                        <Link to="/" className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-brand-700 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                                A
                            </div>
                            <span className="font-display font-bold text-lg text-white">
                                AADYAM
                            </span>
                        </Link>
                        <p className="text-slate-300 text-sm leading-relaxed mb-6">
                            Redefining global logistics with cutting-edge technology and a commitment to excellence.
                            Reliable, secure, and always on time.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-display font-semibold text-white mb-6">Platform</h4>
                        <ul className="space-y-3 text-sm text-slate-300">
                            <li><Link to="/track" className="hover:text-brand-400 transition-colors">Track Shipment</Link></li>
                            <li><Link to="/employee-dashboard" className="hover:text-brand-400 transition-colors">Employee Portal</Link></li>
                            <li><Link to="/manager-dashboard" className="hover:text-brand-400 transition-colors">Manager Suite</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-display font-semibold text-white mb-6">Services</h4>
                        <ul className="space-y-3 text-sm text-slate-300">
                            <li><Link to="/" className="hover:text-brand-400 transition-colors">Global Freight</Link></li>
                            <li><Link to="/" className="hover:text-brand-400 transition-colors">Supply Chain Analytics</Link></li>
                            <li><Link to="/" className="hover:text-brand-400 transition-colors">Warehousing</Link></li>
                            <li><Link to="/" className="hover:text-brand-400 transition-colors">Last Mile Delivery</Link></li>
                        </ul>
                    </div>

                    {/* Contact - Clean Layout */}
                    <div>
                        <h4 className="font-display font-semibold text-white mb-6">Contact</h4>
                        <div className="space-y-4 text-sm text-slate-300">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-brand-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>support@adyamlogistics.com</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-brand-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>
                                    Corporate HQ<br />
                                    New Delhi, India
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500">
                        &copy; {new Date().getFullYear()} Aadyam Logistics Private Limited. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs text-slate-500">
                        <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
