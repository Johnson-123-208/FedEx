import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import KPICard from '../components/KPICard';
import Table from '../components/Table';
import StatusBadge from '../components/StatusBadge';
import { shipments, kpiData } from '../data/mockData';

/**
 * Employee Dashboard - View and manage shipments
 */
const EmployeeDashboard = () => {
    const [filterStatus, setFilterStatus] = useState('all');

    // Filter shipments based on status
    const filteredShipments = filterStatus === 'all'
        ? shipments
        : shipments.filter(s => s.status === filterStatus);

    // Table columns configuration
    const columns = [
        { key: 'awb', label: 'AWB Number' },
        { key: 'date', label: 'Date' },
        { key: 'sender', label: 'Sender' },
        { key: 'destination', label: 'Destination' },
        { key: 'weight', label: 'Weight (kg)', render: (value) => `${value} kg` },
        { key: 'contents', label: 'Contents' },
        { key: 'status', label: 'Status' },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <button className="text-purple-600 hover:text-purple-800 font-medium">
                    View Details
                </button>
            )
        }
    ];

    const statusFilters = [
        { value: 'all', label: 'All Shipments', count: shipments.length },
        { value: 'delivered', label: 'Delivered', count: shipments.filter(s => s.status === 'delivered').length },
        { value: 'in_transit', label: 'In Transit', count: shipments.filter(s => s.status === 'in_transit').length },
        { value: 'out_for_delivery', label: 'Out for Delivery', count: shipments.filter(s => s.status === 'out_for_delivery').length },
        { value: 'pending', label: 'Pending', count: shipments.filter(s => s.status === 'pending').length },
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
                        Employee Dashboard
                    </h1>
                    <p className="text-lg text-gray-600">
                        Manage and track all shipments in one place
                    </p>
                </motion.div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <KPICard
                        title="Total Shipments"
                        value={kpiData.totalShipments}
                        icon="📦"
                        trend="up"
                        trendValue="12%"
                        color="blue"
                    />
                    <KPICard
                        title="Delivered"
                        value={kpiData.delivered}
                        icon="✅"
                        trend="up"
                        trendValue="8%"
                        color="green"
                    />
                    <KPICard
                        title="In Transit"
                        value={kpiData.inTransit}
                        icon="🚚"
                        trend="down"
                        trendValue="3%"
                        color="yellow"
                    />
                    <KPICard
                        title="On-Time Rate"
                        value={`${kpiData.onTimeRate}%`}
                        icon="⏱️"
                        trend="up"
                        trendValue="2.5%"
                        color="purple"
                    />
                </div>

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                >
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90 mb-1">Avg Delivery Time</p>
                                <p className="text-3xl font-bold">{kpiData.avgDeliveryTime}</p>
                            </div>
                            <div className="text-5xl opacity-80">⏰</div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90 mb-1">Customer Satisfaction</p>
                                <p className="text-3xl font-bold">{kpiData.customerSatisfaction}/5.0</p>
                            </div>
                            <div className="text-5xl opacity-80">⭐</div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90 mb-1">Pending Actions</p>
                                <p className="text-3xl font-bold">{kpiData.pending}</p>
                            </div>
                            <div className="text-5xl opacity-80">📋</div>
                        </div>
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white rounded-xl shadow-lg p-6 mb-8"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Status</h3>
                    <div className="flex flex-wrap gap-3">
                        {statusFilters.map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setFilterStatus(filter.value)}
                                className={`
                  px-4 py-2 rounded-lg font-medium transition-all
                  ${filterStatus === filter.value
                                        ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }
                `}
                            >
                                {filter.label}
                                <span className="ml-2 px-2 py-0.5 rounded-full bg-white bg-opacity-20 text-sm">
                                    {filter.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Shipments Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">
                            Shipments ({filteredShipments.length})
                        </h3>
                        <button className="btn-primary">
                            + Add New Shipment
                        </button>
                    </div>

                    <Table
                        data={filteredShipments}
                        columns={columns}
                        sortable={true}
                        filterable={true}
                    />
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    <button className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow text-left">
                        <div className="text-4xl mb-3">📊</div>
                        <h4 className="font-bold text-gray-900 mb-2">Generate Report</h4>
                        <p className="text-sm text-gray-600">Create detailed shipment reports</p>
                    </button>

                    <button className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow text-left">
                        <div className="text-4xl mb-3">📧</div>
                        <h4 className="font-bold text-gray-900 mb-2">Send Notifications</h4>
                        <p className="text-sm text-gray-600">Notify customers about updates</p>
                    </button>

                    <button className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow text-left">
                        <div className="text-4xl mb-3">⚙️</div>
                        <h4 className="font-bold text-gray-900 mb-2">Settings</h4>
                        <p className="text-sm text-gray-600">Configure dashboard preferences</p>
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
