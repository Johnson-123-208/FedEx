import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Table from '../../components/Table';

const MyShipments = () => {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    // Load data from sheet-wise JSON files
    useEffect(() => {
        const loadData = async () => {
            try {
                // Load the index to get metrics and sheet list
                const indexResponse = await fetch('/data/sheets_index.json');
                if (!indexResponse.ok) {
                    throw new Error(`Failed to load index: ${indexResponse.status}`);
                }

                const indexData = await indexResponse.json();

                // Load ALL sheets
                let allShipments = [];
                const sheets = indexData.sheets;

                // Helper function to fetch a batch
                const fetchBatch = (batch) => Promise.all(
                    batch.map(sheet => fetch(`/data/${sheet.file}`).then(res => res.json()))
                );

                // Process in chunks to prevent UI blocking
                const batchSize = 5;
                for (let i = 0; i < sheets.length; i += batchSize) {
                    const batch = sheets.slice(i, i + batchSize);
                    const batchResults = await fetchBatch(batch);

                    for (const data of batchResults) {
                        if (data && data.shipments) {
                            allShipments = allShipments.concat(data.shipments);
                        }
                    }
                }

                // Transform data for table
                const transformedShipments = allShipments.map((row, index) => ({
                    id: index, // Unique ID for React keys
                    awb: row.awb || 'N/A',
                    date: row.date || '2025-01-11',
                    sender: row.sender || 'N/A',
                    destination: row.destination || 'N/A',
                    weight: row.weight || '0',
                    status: (row.status || 'Unknown').toLowerCase().replace(/ /g, '_'),
                    rawStatus: row.status || 'Unknown'
                }));

                setShipments(transformedShipments);
                setLoading(false);
            } catch (error) {
                console.error('Error loading shipments:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const filteredShipments = React.useMemo(() => {
        if (filterStatus === 'all') return shipments;

        return shipments.filter(s => {
            const status = s.status.toLowerCase();
            switch (filterStatus) {
                case 'delivered':
                    return status.includes('deliver');
                case 'in_transit':
                    return status.includes('transit');
                case 'out_for_delivery':
                    return status.includes('out') && status.includes('delivery');
                case 'pending':
                    return status.includes('pending');
                default:
                    return true;
            }
        });
    }, [shipments, filterStatus]);

    const columns = [
        { key: 'awb', label: 'AWB' },
        { key: 'date', label: 'Date' },
        { key: 'sender', label: 'Sender' },
        { key: 'destination', label: 'Destination' },
        {
            key: 'weight',
            label: 'Weight',
            render: (val) => (
                <span className="font-mono text-[#555555]">
                    {val} <span className="text-xs">kg</span>
                </span>
            )
        },
        {
            key: 'rawStatus',
            label: 'Status',
            render: (val) => {
                const statusColors = {
                    'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    'In Transit': 'bg-blue-50 text-blue-700 border-blue-200',
                    'Out for Delivery': 'bg-amber-50 text-amber-700 border-amber-200',
                    'Pending': 'bg-slate-50 text-slate-700 border-slate-200',
                    'Exception': 'bg-rose-50 text-rose-700 border-rose-200'
                };
                const colorClass = statusColors[val] || statusColors['Pending'];
                return (
                    <span className={`badge ${colorClass}`}>
                        {val}
                    </span>
                );
            }
        },
        {
            key: 'actions',
            label: 'Actions',
            render: () => (
                <button className="text-brand-500 hover:text-brand-600 font-medium text-xs border border-brand-500/30 px-3 py-1 rounded hover:bg-brand-50 transition-colors">
                    View
                </button>
            )
        }
    ];

    const statusFilters = [
        { value: 'all', label: 'All', count: shipments.length },
        { value: 'delivered', label: 'Delivered', count: shipments.filter(s => s.status.includes('deliver')).length },
        { value: 'in_transit', label: 'In Transit', count: shipments.filter(s => s.status.includes('transit')).length },
        { value: 'out_for_delivery', label: 'Out for Delivery', count: shipments.filter(s => s.status.includes('out') && s.status.includes('delivery')).length },
        { value: 'pending', label: 'Pending', count: shipments.filter(s => s.status.includes('pending')).length },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[#555555]">Loading shipment data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8">
                <p className="text-red-500">Error: {error}</p>
                <button onClick={() => window.location.reload()} className="btn-primary mt-4">Retry</button>
            </div>
        );
    }

    return (
        <div className="w-full px-6 py-8">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-[#222222] mb-2 font-display">My Shipments</h1>
                <p className="text-[#555555]">View and manage all your assigned shipments.</p>
            </motion.div>

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
                                    ? 'bg-brand-500 text-white border border-brand-500 shadow-lg'
                                    : 'bg-white text-[#555555] border-2 border-[#EEEEEE] hover:bg-[#F5F5F5] hover:text-[#222222] hover:border-brand-500/30'
                                }
                            `}
                        >
                            {filter.label}
                            <span className={`
                                ml-2 text-xs opacity-60 px-1.5 py-0.5 rounded
                                ${filterStatus === filter.value ? 'bg-white/20' : 'bg-[#F5F5F5]'}
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
                <div className="bg-white rounded-xl shadow-sm border border-[#EEEEEE] overflow-hidden">
                    <Table
                        data={filteredShipments}
                        columns={columns}
                        sortable={true}
                        filterable={true}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default MyShipments;
