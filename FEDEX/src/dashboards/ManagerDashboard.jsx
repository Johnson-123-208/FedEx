import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import KPICard from '../components/KPICard';
import Table from '../components/Table';
import PerformanceChart from '../charts/PerformanceChart';
import StatusPieChart from '../charts/StatusPieChart';
import RegionChart from '../charts/RegionChart';
import {
    kpiData,
    employeeData,
    monthlyPerformance,
    deliveryStatusBreakdown,
    regionPerformance
} from '../data/mockData';

/**
 * Manager Dashboard - Analytics and team performance overview
 */
const ManagerDashboard = () => {
    // Employee table columns
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
                <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                            style={{ width: `${value}%` }}
                        ></div>
                    </div>
                    <span className="font-semibold">{value}%</span>
                </div>
            )
        },
        {
            key: 'rating',
            label: 'Rating',
            render: (value) => (
                <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-semibold">{value}</span>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 font-display">
                        Manager Dashboard
                    </h1>
                    <p className="text-lg text-gray-600">
                        Monitor team performance and business metrics
                    </p>
                </motion.div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <KPICard
                        title="Total Revenue"
                        value="₹12.5M"
                        icon="💰"
                        trend="up"
                        trendValue="18%"
                        color="green"
                    />
                    <KPICard
                        title="Active Employees"
                        value="247"
                        icon="👥"
                        trend="up"
                        trendValue="5%"
                        color="blue"
                    />
                    <KPICard
                        title="Customer Satisfaction"
                        value={`${kpiData.customerSatisfaction}/5.0`}
                        icon="⭐"
                        trend="up"
                        trendValue="0.3"
                        color="yellow"
                    />
                    <KPICard
                        title="On-Time Delivery"
                        value={`${kpiData.onTimeRate}%`}
                        icon="✅"
                        trend="up"
                        trendValue="2.1%"
                        color="purple"
                    />
                </div>

                {/* Performance Metrics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                >
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold opacity-90">Daily Average</h3>
                            <div className="text-3xl">📈</div>
                        </div>
                        <p className="text-4xl font-bold mb-2">342</p>
                        <p className="text-sm opacity-90">Shipments per day</p>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="text-sm">↑ 15% from last week</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold opacity-90">Peak Hours</h3>
                            <div className="text-3xl">⏰</div>
                        </div>
                        <p className="text-4xl font-bold mb-2">10-2 PM</p>
                        <p className="text-sm opacity-90">Highest activity period</p>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="text-sm">456 shipments/hour</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold opacity-90">Top Region</h3>
                            <div className="text-3xl">🏆</div>
                        </div>
                        <p className="text-4xl font-bold mb-2">South</p>
                        <p className="text-sm opacity-90">Best performing region</p>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="text-sm">96% efficiency rate</span>
                        </div>
                    </div>
                </motion.div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <PerformanceChart
                            data={monthlyPerformance}
                            title="Monthly Performance Trends"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <StatusPieChart
                            data={deliveryStatusBreakdown}
                            title="Delivery Status Breakdown"
                        />
                    </motion.div>
                </div>

                {/* Region Performance Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mb-8"
                >
                    <RegionChart
                        data={regionPerformance}
                        title="Regional Performance Comparison"
                    />
                </motion.div>

                {/* Employee Performance Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-white rounded-xl shadow-lg p-6 mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">
                            Employee Performance
                        </h3>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition-colors">
                                Export Data
                            </button>
                            <button className="btn-primary">
                                View All Employees
                            </button>
                        </div>
                    </div>

                    <Table
                        data={employeeData}
                        columns={employeeColumns}
                        sortable={true}
                        filterable={true}
                    />
                </motion.div>

                {/* Insights & Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {/* Key Insights */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Key Insights</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl">✅</div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                        On-Time Performance Improved
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Delivery punctuality increased by 2.1% this month
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl">📊</div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                        South Region Leading
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        South region maintains highest efficiency at 96%
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                                <div className="text-2xl">⚠️</div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                        East Region Needs Attention
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Consider additional resources for East region operations
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:shadow-lg transition-shadow">
                                <span className="text-2xl">📋</span>
                                <div className="text-left">
                                    <h4 className="font-semibold">Generate Monthly Report</h4>
                                    <p className="text-sm opacity-90">Create comprehensive analytics report</p>
                                </div>
                            </button>

                            <button className="w-full flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-500 transition-colors">
                                <span className="text-2xl">👥</span>
                                <div className="text-left">
                                    <h4 className="font-semibold text-gray-900">Manage Team</h4>
                                    <p className="text-sm text-gray-600">View and update employee assignments</p>
                                </div>
                            </button>

                            <button className="w-full flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-500 transition-colors">
                                <span className="text-2xl">⚙️</span>
                                <div className="text-left">
                                    <h4 className="font-semibold text-gray-900">System Settings</h4>
                                    <p className="text-sm text-gray-600">Configure platform preferences</p>
                                </div>
                            </button>

                            <button className="w-full flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-500 transition-colors">
                                <span className="text-2xl">📧</span>
                                <div className="text-left">
                                    <h4 className="font-semibold text-gray-900">Send Announcements</h4>
                                    <p className="text-sm text-gray-600">Notify team about updates</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
