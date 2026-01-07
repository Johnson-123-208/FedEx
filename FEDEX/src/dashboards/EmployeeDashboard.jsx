import React, { useState } from 'react';
import { motion } from 'framer-motion';
// import Header from '../components/Header'; // Removed: Handled by Layout
import KPICard from '../components/KPICard';
import Table from '../components/Table';
import { shipments, kpiData } from '../data/mockData';

const EmployeeDashboard = () => {
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredShipments = filterStatus === 'all'
        ? shipments
        : shipments.filter(s => s.status === filterStatus);

    const columns = [
        { key: 'awb', label: 'AWB' },
        { key: 'date', label: 'Date' },
        { key: 'sender', label: 'Sender' },
        { key: 'destination', label: 'Destination' },
        { key: 'weight', label: 'Weight', render: (val) => <span className="font-mono text-slate-400">{val} <span className="text-xs">kg</span></span> },
        { key: 'status', label: 'Status' },
        {
            key: 'actions',
            label: 'Actions',
            render: () => (
                <button className="text-brand-400 hover:text-brand-300 font-medium text-xs border border-brand-500/30 px-3 py-1 rounded hover:bg-brand-500/10 transition-colors">
                    View
                </button>
            )
        }
    ];

    const statusFilters = [
        { value: 'all', label: 'All', count: shipments.length },
        { value: 'delivered', label: 'Delivered', count: shipments.filter(s => s.status === 'delivered').length },
        { value: 'in_transit', label: 'In Transit', count: shipments.filter(s => s.status === 'in_transit').length },
        { value: 'out_for_delivery', label: 'Out for Delivery', count: shipments.filter(s => s.status === 'out_for_delivery').length },
        { value: 'pending', label: 'Pending', count: shipments.filter(s => s.status === 'pending').length },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-3xl font-bold text-white mb-2 font-display">Employee Hub</h1>
                    <p className="text-slate-400">Welcome back, Agent. Here's your daily overview.</p>
                </motion.div>
                <div className="flex gap-3">
                    <button className="btn-secondary text-sm">Download Report</button>
                    <button className="btn-primary text-sm">+ New Shipment</button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <KPICard title="Total Shipments" value={kpiData.totalShipments} icon="📦" trend="up" trendValue="12%" color="blue" />
                <KPICard title="Delivered Today" value={kpiData.delivered} icon="✅" trend="up" trendValue="8%" color="green" />
                <KPICard title="In Transit" value={kpiData.inTransit} icon="🚚" trend="down" trendValue="3%" color="yellow" />
                <KPICard title="Performance" value={`${kpiData.onTimeRate}%`} icon="⚡" trend="up" trendValue="2.5%" color="purple" />
            </div>

            {/* Filters */}
            <motion.div
                className="mb-6 overflow-x-auto pb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex gap-2 min-w-max">
                    {statusFilters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setFilterStatus(filter.value)}
                            className={`
                                relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                                ${filterStatus === filter.value
                                    ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30 shadow-glow-sm'
                                    : 'bg-slate-900/50 text-slate-400 border border-white/5 hover:bg-white/5 hover:text-white'
                                }
                            `}
                        >
                            {filter.label}
                            <span className={`
                                ml-2 text-xs opacity-60 px-1.5 py-0.5 rounded
                                ${filterStatus === filter.value ? 'bg-brand-500/30' : 'bg-slate-800'}
                            `}>
                                {filter.count}
                            </span>
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Main Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Table
                    data={filteredShipments}
                    columns={columns}
                    sortable={true}
                    filterable={true}
                />
            </motion.div>
        </div>
    );
};

export default EmployeeDashboard;
