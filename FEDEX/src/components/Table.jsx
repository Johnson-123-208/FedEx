import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StatusBadge from './StatusBadge';

/**
 * Reusable Data Table component with sorting and filtering
 * @param {Object} props - Component props
 * @param {Array} props.data - Table data
 * @param {Array} props.columns - Column definitions
 * @param {boolean} props.sortable - Enable sorting
 * @param {boolean} props.filterable - Enable filtering
 */
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

                if (aVal < bVal) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aVal > bVal) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
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

        if (column.render) {
            return column.render(value, row);
        }

        if (column.key === 'status') {
            return <StatusBadge status={value} size="sm" />;
        }

        return value;
    };

    return (
        <div className="w-full">
            {filterable && (
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>
            )}

            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white">
                    <thead className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    onClick={() => requestSort(column.key)}
                                    className={`px-6 py-4 text-left text-sm font-semibold ${sortable ? 'cursor-pointer hover:bg-purple-700' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {column.label}
                                        {sortable && sortConfig.key === column.key && (
                                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredData.map((row, index) => (
                            <motion.tr
                                key={row.id || index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                {columns.map((column) => (
                                    <td key={column.key} className="px-6 py-4 text-sm text-gray-900">
                                        {renderCell(column, row)}
                                    </td>
                                ))}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>

                {filteredData.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg">No data found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Table;
