import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StatusBadge from './StatusBadge';

const Table = ({ data, columns, sortable = true, filterable = false }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

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

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

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

    const goToPage = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
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
                            onChange={(e) => {
                                setFilter(e.target.value);
                                setCurrentPage(1); // Reset to first page on search
                            }}
                            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-[#EEEEEE] rounded-lg text-[#222222] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                        />
                        <svg className="w-5 h-5 text-[#999999] absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            )}

            <div className="overflow-hidden rounded-xl border-2 border-[#EEEEEE] bg-white shadow-sm">
                <table className="min-w-full divide-y divide-[#EEEEEE]">
                    <thead className="bg-[#F5F5F5]">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    onClick={() => requestSort(column.key)}
                                    className={`px-6 py-4 text-left text-xs font-semibold text-[#777777] uppercase tracking-wider ${sortable ? 'cursor-pointer hover:text-[#222222] transition-colors' : ''
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
                    <tbody className="divide-y divide-[#EEEEEE]">
                        {paginatedData.map((row, index) => (
                            <motion.tr
                                key={row.id || startIndex + index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.03 }}
                                className="group hover:bg-[#F5F5F5] transition-colors"
                            >
                                {columns.map((column) => (
                                    <td key={column.key} className="px-6 py-4 text-sm text-[#555555] group-hover:text-[#222222] transition-colors whitespace-nowrap">
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

            {/* Pagination Controls */}
            {filteredData.length > 0 && (
                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-[#555555]">
                        Showing <span className="font-semibold text-[#222222]">{startIndex + 1}</span> to{' '}
                        <span className="font-semibold text-[#222222]">{Math.min(endIndex, filteredData.length)}</span> of{' '}
                        <span className="font-semibold text-[#222222]">{filteredData.length}</span> results
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goToPage(1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 rounded-lg bg-white border border-[#EEEEEE] text-[#555555] hover:bg-[#F5F5F5] hover:text-[#222222] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            ««
                        </button>
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 rounded-lg bg-white border border-[#EEEEEE] text-[#555555] hover:bg-[#F5F5F5] hover:text-[#222222] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            ‹
                        </button>

                        <div className="flex items-center gap-1">
                            {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={i}
                                        onClick={() => goToPage(pageNum)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${currentPage === pageNum
                                            ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                                            : 'bg-white border border-[#EEEEEE] text-[#555555] hover:bg-[#F5F5F5] hover:text-[#222222]'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            ›
                        </button>
                        <button
                            onClick={() => goToPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            »»
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;
