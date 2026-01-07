import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StatusBadge from './StatusBadge';

const Table = ({ data, columns, sortable = true, filterable = false }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filter, setFilter] = useState('');

    // Sort data
    const sortedData = React.useMemo(() => {
        let sortableData = [...data];
        if (sortConfig.key) {
            sortableData.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableData;
    }, [data, sortConfig]);

    // Filter data
    const filteredData = React.useMemo(() => {
        if (!filter) return sortedData;
        return sortedData.filter((row) =>
            Object.values(row).some((value) =>
                String(value).toLowerCase().includes(filter.toLowerCase())
            )
        );
    }, [sortedData, filter]);

    const requestSort = (key) => {
        if (!sortable) return;
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const renderCell = (column, row) => {
        const value = row[column.key];
        if (column.render) return column.render(value, row);
        if (column.key === 'status') return <StatusBadge status={value} size="sm" />;
        return value;
    };

    return (
        <div className="w-full">
            {filterable && (
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search data..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all"
                        />
                        <svg className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-white/5 bg-slate-900/40 backdrop-blur-sm">
                <table className="min-w-full divide-y divide-white/5">
                    <thead className="bg-slate-900/80">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    onClick={() => requestSort(column.key)}
                                    className={`px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider ${sortable ? 'cursor-pointer hover:text-white transition-colors' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {column.label}
                                        {sortable && sortConfig.key === column.key && (
                                            <span className="text-brand-400">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredData.map((row, index) => (
                            <motion.tr
                                key={row.id || index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.03 }}
                                className="group hover:bg-white/5 transition-colors"
                            >
                                {columns.map((column) => (
                                    <td key={column.key} className="px-6 py-4 text-sm text-slate-300 group-hover:text-white transition-colors whitespace-nowrap">
                                        {renderCell(column, row)}
                                    </td>
                                ))}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>

                {filteredData.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        <svg className="w-12 h-12 mx-auto mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg">No records found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Table;
