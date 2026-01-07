import React from 'react';
import { motion } from 'framer-motion';

const Timeline = ({ timeline }) => {
    return (
        <div className="relative pl-4 border-l border-slate-800 space-y-8 my-4">
            {timeline.map((item, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="relative pl-6"
                >
                    {/* Dot */}
                    <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 ${item.completed
                            ? 'bg-brand-500 border-brand-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                            : 'bg-slate-900 border-slate-600'
                        }`}></div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <h4 className={`text-sm font-semibold ${item.completed ? 'text-white' : 'text-slate-500'}`}>
                            {item.status}
                        </h4>
                        <span className="text-xs font-mono text-slate-500 bg-slate-900/50 px-2 py-0.5 rounded border border-white/5">
                            {item.date}
                        </span>
                    </div>
                    <p className="text-sm text-slate-400">{item.location}</p>
                </motion.div>
            ))}
        </div>
    );
};

export default Timeline;
