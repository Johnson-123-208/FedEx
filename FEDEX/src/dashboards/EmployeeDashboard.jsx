import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import KPICard from '../components/KPICard';
import Table from '../components/Table';

const EmployeeDashboard = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState('all');

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const [shipments, setShipments] = useState([]);
    const [metrics, setMetrics] = useState({
        total: 0,
        delivered: 0,
        in_transit: 0,
        success_rate: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load data from sheet-wise JSON files
    useEffect(() => {
        const loadData = async () => {
            try {
                console.log('Loading shipments index...');

                // Load the index to get metrics and sheet list
                const indexResponse = await fetch('/data/sheets_index.json');
                if (!indexResponse.ok) {
                    throw new Error(`Failed to load index: ${indexResponse.status}`);
                }

                const indexData = await indexResponse.json();
                console.log('Index loaded:', indexData.metrics);

                // Set metrics immediately
                setMetrics(indexData.metrics);

                // Load ALL sheets
                let allShipments = [];
                const sheets = indexData.sheets;

                // Process in chunks to prevent UI blocking
                // Helper function to fetch a batch
                const fetchBatch = (batch) => Promise.all(
                    batch.map(sheet => fetch(`/data/${sheet.file}`).then(res => res.json()))
                );

                // Process in chunks to prevent UI blocking
                const batchSize = 5;
                for (let i = 0; i < sheets.length; i += batchSize) {
                    const batch = sheets.slice(i, i + batchSize);
                    console.log(`Loading batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sheets.length / batchSize)}...`);

                    const batchResults = await fetchBatch(batch);

                    // Safe combine using concat
                    batchResults.forEach(data => {
                        if (data && data.shipments) {
                            allShipments = allShipments.concat(data.shipments);
                        }
                    });
                }

                console.log(`Loaded ${allShipments.length} total shipments`);

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
                <span className="font-mono text-slate-400">
                    {val} <span className="text-xs">kg</span>
                </span>
            )
        },
        {
            key: 'rawStatus',
            label: 'Status',
            render: (val) => {
                const statusColors = {
                    'Delivered': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                    'In Transit': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                    'Out for Delivery': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                    'Pending': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
                    'Exception': 'bg-rose-500/10 text-rose-400 border-rose-500/20'
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
                <button className="text-brand-400 hover:text-brand-300 font-medium text-xs border border-brand-500/30 px-3 py-1 rounded hover:bg-brand-500/10 transition-colors">
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
            <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading shipment data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
                <div className="text-center glass-card p-8 max-w-md">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Error Loading Data</h2>
                    <p className="text-slate-400 mb-4">{error}</p>
                    <p className="text-sm text-slate-500">Make sure the Flask server is running on port 5000</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-primary mt-4"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

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
                    <button onClick={handleSignOut} className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium">
                        Logout
                    </button>
                    <button className="btn-secondary text-sm">Download Report</button>
                    <button className="btn-primary text-sm">+ New Shipment</button>
                </div>
            </div>

            {/* KPI Cards - Real Data */}
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
