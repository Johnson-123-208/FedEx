import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = ({ children, role }) => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();


    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    // Define Role-Based Navigation Links
    const links = role === 'manager' ? [
        { name: 'Overview', path: '/manager-dashboard', icon: 'M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zM3 14h7v7H3v-7z' },
        { name: 'All Shipments', path: '/manager/shipments', icon: 'M20 7h-9.21a2 2 0 00-1.56-.73H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2z' },
        { name: 'Agent Performance', path: '/manager/performance', icon: 'M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a5.5 5.5 0 01-1.251 9.206' },
    ] : [
        { name: 'Overview', path: '/employee-dashboard', icon: 'M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zM3 14h7v7H3v-7z' },
        { name: 'My Shipments', path: '/employee/shipments', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z' },
        { name: 'Profile', path: '/employee/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
    ];

    return (
        <div className="min-h-screen bg-[#0B1120] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-white/5 hidden md:flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center font-bold text-white">
                            {role === 'manager' ? 'M' : 'E'}
                        </div>
                        <div>
                            <h2 className="font-display font-bold text-white tracking-wide">AADYAM</h2>
                            <p className="text-xs text-brand-400 uppercase tracking-wider">{role} Portal</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {links.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                                    ${isActive
                                        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
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

                <div className="mt-auto p-6 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-400">
                            {user?.email?.[0].toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm text-white truncate">{user?.email}</p>
                            <p className="text-xs text-slate-500 truncate capitalize">{role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm font-medium"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto relative">
                {/* Mobile Header (Visible only on small screens) */}
                <div className="md:hidden h-16 bg-slate-900 border-b border-white/5 flex items-center justify-between px-4 sticky top-0 z-40">
                    <span className="font-display font-bold text-white">AADYAM LOGISTICS</span>
                    <button onClick={handleSignOut} className="text-sm text-red-400">Sign Out</button>
                </div>

                <div className="p-6 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
