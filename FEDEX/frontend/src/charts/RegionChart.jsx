import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

/**
 * Region Performance Bar Chart component
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data
 * @param {string} props.title - Chart title
 */
const RegionChart = ({ data, title }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
        >
            <h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="region" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                    />
                    <Legend />
                    <Bar
                        dataKey="shipments"
                        fill="#667eea"
                        radius={[8, 8, 0, 0]}
                        name="Total Shipments"
                    />
                    <Bar
                        dataKey="efficiency"
                        fill="#10b981"
                        radius={[8, 8, 0, 0]}
                        name="Efficiency %"
                    />
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    );
};

export default RegionChart;
