import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = ({ children, role }) => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


    const handleSignOut = async () => {
        if (window.confirm("Are you sure you want to log out?")) {
            await signOut();
            navigate('/login');
        }
    };

    // Define Role-Based Navigation Links
    const links = role === 'manager' ? [
        { name: 'Home', path: '/', icon: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' },
        { name: 'Overview', path: '/manager-dashboard', icon: 'M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zM3 14h7v7H3v-7z' },
        { name: 'All Shipments', path: '/manager/shipments', icon: 'M20 7h-9.21a2 2 0 00-1.56-.73H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2z' },
        { name: 'Agent Performance', path: '/manager/performance', icon: 'M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a5.5 5.5 0 01-1.251 9.206' },
    ] : [
        { name: 'Home', path: '/', icon: 'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' },
        { name: 'Overview', path: '/employee-dashboard', icon: 'M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zM3 14h7v7H3v-7z' },
        { name: 'My Shipments', path: '/employee/shipments', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z' },
        { name: 'Bulk Upload', path: '/employee/bulk-upload', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' },
        { name: 'Profile', path: '/employee/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center font-bold text-white">
                        {role === 'manager' ? 'M' : 'E'}
                    </div>
                    <div>
                        <h2 className="font-display font-bold text-[#222222] tracking-wide">AADYAM</h2>
                        <p className="text-xs text-brand-500 uppercase tracking-wider">{role} Portal</p>
                    </div>
                </div>

                <nav className="space-y-1">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                                ${isActive
                                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                                    : 'text-[#555555] hover:bg-[#F5F5F5] hover:text-[#222222]'
                                }
                            `}
                        >
                            <svg className="w-5 h-5 opacity-70" viewBox="0 0 24 24" fill="currentColor">
                                <path d={link.icon} />
                            </svg>
                            <span className="font-medium text-sm">{link.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-[#EEEEEE]">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs text-brand-700 font-semibold">
                        {user?.email?.[0].toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm text-[#222222] truncate">{user?.email}</p>
                        <p className="text-xs text-[#777777] truncate capitalize">{role}</p>
                    </div>
                </div>
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-red-600/20 text-red-600 hover:bg-red-500/10 hover:text-red-700 transition-all text-sm font-medium"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F5F5F5] flex">
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-white border-r border-[#EEEEEE] hidden md:flex flex-col shadow-sm fixed h-full z-30">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-64 bg-white z-50 md:hidden border-r border-[#EEEEEE] shadow-xl"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto relative md:ml-64 w-full">
                {/* Mobile Header */}
                <div className="md:hidden h-16 bg-white border-b border-[#EEEEEE] flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-gray-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <span className="font-display font-bold text-[#222222]">AADYAM LOGISTICS</span>
                    <button onClick={handleSignOut} className="text-sm text-red-400">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>

                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
