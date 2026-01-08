import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import KPICard from '../components/KPICard';
import Table from '../components/Table';
import PerformanceChart from '../charts/PerformanceChart';
import StatusPieChart from '../charts/StatusPieChart';
import RegionChart from '../charts/RegionChart';
import {
    employeeData,
    monthlyPerformance,
    deliveryStatusBreakdown,
    regionPerformance
} from '../data/mockData';

const ManagerDashboard = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState({
        total: 0,
        delivered: 0,
        in_transit: 0,
        success_rate: 0
    });
    const [loading, setLoading] = useState(true);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    // Fetch real metrics from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/shipments');
                const data = await response.json();
                setMetrics(data.metrics);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching metrics:', error);
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const employeeColumns = [
        { key: 'name', label: 'Employee Name' },
        { key: 'role', label: 'Role' },
        { key: 'region', label: 'Region' },
        { key: 'deliveries', label: 'Deliveries' },
        { key: 'onTime', label: 'On Time' },
        { key: 'delayed', label: 'Delayed' },
        {
            key: 'efficiency',
            label: 'Efficiency',
            render: (value) => (
                <div className="flex items-center gap-2 w-full max-w-[140px]">
                    <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                            className="bg-brand-500 h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            style={{ width: `${value}%` }}
                        ></div>
                    </div>
                    <span className="font-mono text-xs text-brand-300">{value}%</span>
                </div>
            )
        },
        {
            key: 'rating',
            label: 'Rating',
            render: (value) => (
                <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-xs">⭐</span>
                    <span className="font-semibold text-slate-200">{value}</span>
                </div>
            )
        }
    ];

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 text-slate-300">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-3xl font-bold text-white mb-2 font-display">Manager Dashboard</h1>
                    <p className="text-slate-400">Executive overview and operational metrics.</p>
                </motion.div>
                <div className="flex gap-3">
                    <button onClick={handleSignOut} className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium">
                        Logout
                    </button>
                    <button className="btn-secondary text-sm">Review Alerts</button>
                    <button className="btn-primary text-sm">Global Settings</button>
                </div>
            </div>

            {/* KPI Cards - Real Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KPICard
                    title="Total Shipments"
                    value={metrics.total}
                    icon="📦"
                    trend="up"
                    trendValue="2.8%"
                    color="blue"
                />
                <KPICard
                    title="Delivered"
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
                    title="Success Rate"
                    value={`${metrics.success_rate}%`}
                    icon="⚡"
                    trend="up"
                    trendValue="2.1%"
                    color="purple"
                />
            </div>

            {/* Performance Metrics Rows */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
                {/* Metric Card 1 */}
                <div className="glass-card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="text-6xl">📈</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Daily Average</h3>
                    <div className="text-4xl font-bold text-white mb-2 font-display">342</div>
                    <p className="text-sm text-slate-500 mb-4">Shipments per day</p>
                    <div className="flex items-center text-emerald-400 text-sm font-medium">
                        <span>↑ 15% from last week</span>
                    </div>
                </div>

                {/* Metric Card 2 */}
                <div className="glass-card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="text-6xl">⏰</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Peak Activity</h3>
                    <div className="text-4xl font-bold text-white mb-2 font-display">10AM - 2PM</div>
                    <p className="text-sm text-slate-500 mb-4">Highest volume period</p>
                    <div className="flex items-center text-brand-400 text-sm font-medium">
                        <span>456 shipments/hour max</span>
                    </div>
                </div>

                {/* Metric Card 3 */}
                <div className="glass-card p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="text-6xl">🏆</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Top Region</h3>
                    <div className="text-4xl font-bold text-white mb-2 font-display">South</div>
                    <p className="text-sm text-slate-500 mb-4">Best performing zone</p>
                    <div className="flex items-center text-emerald-400 text-sm font-medium">
                        <span>96% efficiency rate</span>
                    </div>
                </div>
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <motion.div
                    className="glass-card p-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="text-lg font-bold text-white mb-6 font-display">Monthly Performance Trends</h3>
                    <PerformanceChart data={monthlyPerformance} />
                </motion.div>

                <motion.div
                    className="glass-card p-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="text-lg font-bold text-white mb-6 font-display">Delivery Status Breakdown</h3>
                    <StatusPieChart data={deliveryStatusBreakdown} />
                </motion.div>
            </div>

            {/* Region Chart */}
            <motion.div
                className="glass-card p-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <h3 className="text-lg font-bold text-white mb-6 font-display">Regional Performance Comparison</h3>
                <RegionChart data={regionPerformance} />
            </motion.div>

            {/* Employee Table */}
            <motion.div
                className="glass-card p-0 overflow-hidden mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h3 className="text-lg font-bold text-white font-display">Top Employee Performance</h3>
                    <div className="flex gap-3">
                        <button className="text-xs font-medium text-slate-400 hover:text-white transition-colors">Export CSV</button>
                        <button className="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors">View All</button>
                    </div>
                </div>
                <div className="p-6">
                    <Table
                        data={employeeData}
                        columns={employeeColumns}
                        sortable={true}
                        filterable={true}
                    />
                </div>
            </motion.div>

            {/* Insights & Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Key Insights */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-white mb-6 font-display">AI Insights</h3>
                    <div className="space-y-4">
                        <div className="flex gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <div className="text-emerald-400 text-xl">✅</div>
                            <div>
                                <h4 className="font-semibold text-emerald-100">On-Time Performance</h4>
                                <p className="text-sm text-emerald-200/70">Delivery punctuality increased by 2.1% this month.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <div className="text-blue-400 text-xl">📊</div>
                            <div>
                                <h4 className="font-semibold text-blue-100">South Region Leading</h4>
                                <p className="text-sm text-blue-200/70">Maintains highest efficiency at 96% for 3 consecutive months.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <div className="text-amber-400 text-xl">⚠️</div>
                            <div>
                                <h4 className="font-semibold text-amber-100">Capacity Warning</h4>
                                <p className="text-sm text-amber-200/70">East region approaching max capacity during peak hours.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-white mb-6 font-display">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button className="p-4 rounded-xl bg-slate-800/50 hover:bg-brand-600/20 hover:border-brand-500/30 border border-white/5 transition-all text-left group">
                            <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">📋</span>
                            <span className="font-semibold text-slate-200 group-hover:text-white">Generate Report</span>
                        </button>
                        <button className="p-4 rounded-xl bg-slate-800/50 hover:bg-brand-600/20 hover:border-brand-500/30 border border-white/5 transition-all text-left group">
                            <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">👥</span>
                            <span className="font-semibold text-slate-200 group-hover:text-white">Manage Team</span>
                        </button>
                        <button className="p-4 rounded-xl bg-slate-800/50 hover:bg-brand-600/20 hover:border-brand-500/30 border border-white/5 transition-all text-left group">
                            <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">⚙️</span>
                            <span className="font-semibold text-slate-200 group-hover:text-white">System Settings</span>
                        </button>
                        <button className="p-4 rounded-xl bg-slate-800/50 hover:bg-brand-600/20 hover:border-brand-500/30 border border-white/5 transition-all text-left group">
                            <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">📧</span>
                            <span className="font-semibold text-slate-200 group-hover:text-white">Announcements</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
