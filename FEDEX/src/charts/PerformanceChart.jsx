import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

/**
 * Performance Line Chart component
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data
 * @param {string} props.title - Chart title
 */
const PerformanceChart = ({ data, title }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
        >
            <h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
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
                    <Line
                        type="monotone"
                        dataKey="deliveries"
                        stroke="#667eea"
                        strokeWidth={3}
                        dot={{ fill: '#667eea', r: 5 }}
                        activeDot={{ r: 7 }}
                        name="Total Deliveries"
                    />
                    <Line
                        type="monotone"
                        dataKey="onTime"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: '#10b981', r: 5 }}
                        activeDot={{ r: 7 }}
                        name="On Time"
                    />
                    <Line
                        type="monotone"
                        dataKey="delayed"
                        stroke="#ef4444"
                        strokeWidth={3}
                        dot={{ fill: '#ef4444', r: 5 }}
                        activeDot={{ r: 7 }}
                        name="Delayed"
                    />
                </LineChart>
            </ResponsiveContainer>
        </motion.div>
    );
};

export default PerformanceChart;
