import React from 'react';
import { motion } from 'framer-motion';

/**
 * KPI Card component for displaying key metrics
 * @param {Object} props - Component props
 * @param {string} props.title - KPI title
 * @param {string|number} props.value - KPI value
 * @param {string} props.icon - Icon (emoji or text)
 * @param {string} props.trend - Trend indicator (up/down)
 * @param {string} props.trendValue - Trend percentage
 * @param {string} props.color - Color theme (blue/green/yellow/red)
 */
const KPICard = ({ title, value, icon, trend, trendValue, color = 'blue' }) => {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        yellow: 'from-yellow-500 to-yellow-600',
        red: 'from-red-500 to-red-600',
        purple: 'from-purple-500 to-purple-600',
        indigo: 'from-indigo-500 to-indigo-600',
    };

    const iconBgClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        red: 'bg-red-100 text-red-600',
        purple: 'bg-purple-100 text-purple-600',
        indigo: 'bg-indigo-100 text-indigo-600',
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-lg p-6 card-hover"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
                    {trend && trendValue && (
                        <div className="flex items-center gap-1">
                            <span className={`text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {trend === 'up' ? '↑' : '↓'} {trendValue}
                            </span>
                            <span className="text-xs text-gray-500">vs last month</span>
                        </div>
                    )}
                </div>
                <div className={`w-14 h-14 rounded-lg ${iconBgClasses[color]} flex items-center justify-center text-2xl`}>
                    {icon}
                </div>
            </div>
            <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${colorClasses[color]}`}></div>
        </motion.div>
    );
};

export default KPICard;
