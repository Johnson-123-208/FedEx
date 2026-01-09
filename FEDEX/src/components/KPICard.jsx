import React from 'react';
import { motion } from 'framer-motion';

const KPICard = ({ title, value, icon, trend, trendValue, color = 'blue' }) => {
    // Map existing colors to our new brand/slate palette for consistency
    const colorState = {
        blue: { bg: 'bg-brand-500/10', text: 'text-brand-400', border: 'border-brand-500/20' },
        green: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
        yellow: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
        red: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
        purple: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
    }[color] || { bg: 'bg-brand-500/10', text: 'text-brand-400', border: 'border-brand-500/20' };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.3)" }}
            className="
                relative p-6 rounded-2xl border backdrop-blur-sm
                bg-white border-[#EEEEEE] shadow-lg transition-all duration-300
            "
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-sm font-medium text-[#777777] font-display uppercase tracking-wide">{title}</h3>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorState.bg} ${colorState.text} border ${colorState.border}`}>
                    <span className="text-lg">{icon}</span>
                </div>
            </div>

            <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-[#222222] tracking-tight">{value}</span>
                {trend && trendValue && (
                    <div className={`
                        flex items-center text-xs font-semibold px-2 py-1 rounded-full mb-1
                        ${trend === 'up'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'}
                    `}>
                        {trend === 'up' ? '↗' : '↘'} {trendValue}
                    </div>
                )}
            </div>
            {/* Background Gradient Mesh */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent rounded-2xl pointer-events-none" />
        </motion.div>
    );
};

export default KPICard;
