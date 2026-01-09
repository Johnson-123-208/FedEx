import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import KPICard from '../components/KPICard';

const EmployeeDashboard = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        if (window.confirm("Are you sure you want to log out?")) {
            await signOut();
            navigate('/login');
        }
    };

    const [metrics, setMetrics] = useState({
        total: 0,
        delivered: 0,
        in_transit: 0,
        success_rate: 0
    });
    const [loading, setLoading] = useState(true);

    // Load data from sheet-wise JSON files (Metrics only)
    useEffect(() => {
        const loadMetrics = async () => {
            try {
                // Load the index to get metrics
                const indexResponse = await fetch('/data/sheets_index.json');
                if (!indexResponse.ok) {
                    throw new Error(`Failed to load index: ${indexResponse.status}`);
                }

                const indexData = await indexResponse.json();
                setMetrics(indexData.metrics);
                setLoading(false);
            } catch (error) {
                console.error('Error loading metrics:', error);
                setLoading(false);
            }
        };

        loadMetrics();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[#555555]">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-6 py-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-3xl font-bold text-[#222222] mb-2 font-display">Employee Hub</h1>
                    <p className="text-[#555555]">Welcome back, Agent. Here's your daily overview.</p>
                </motion.div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSignOut}
                        className="px-4 py-2 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                        Logout
                    </button>
                    <button className="btn-secondary text-sm">Download Report</button>
                    <button className="btn-primary text-sm" onClick={() => navigate('/track')}>+ Track New</button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <KPICard
                    title="Total Shipments"
                    value={metrics.total}
                    icon="📦"
                    trend="up"
                    trendValue="2.8%"
                    color="blue"
                />
                <KPICard
                    title="Delivered Today"
                    value={metrics.delivered}
                    icon="✅"
                    trend="up"
                    trendValue="8%"
                    color="green"
                />
                <KPICard
                    title="In Transit"
                    value={metrics.in_transit}
                    icon="🚚"
                    trend="down"
                    trendValue="3%"
                    color="yellow"
                />
                <KPICard
                    title="Performance"
                    value={`${metrics.success_rate}% `}
                    icon="⚡"
                    trend="up"
                    trendValue="2.5%"
                    color="purple"
                />
            </div>

            {/* Quick Actions / Recent Activity Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-[#EEEEEE] rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-[#222222] mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => navigate('/employee/shipments')} className="p-4 bg-brand-50 hover:bg-brand-100 rounded-lg text-brand-700 font-medium transition-colors text-left">
                            📄 View All Shipments
                        </button>
                        <button onClick={() => navigate('/employee/profile')} className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 font-medium transition-colors text-left">
                            👤 Update Profile
                        </button>
                    </div>
                </div>
                <div className="bg-white border border-[#EEEEEE] rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-[#222222] mb-4">Updates & Announcements</h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-brand-500 mt-2"></div>
                            <p className="text-sm text-[#555555]">System maintenance scheduled for this Sunday at 2 AM.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                            <p className="text-sm text-[#555555]">New "Express" delivery option is now available for booking.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
