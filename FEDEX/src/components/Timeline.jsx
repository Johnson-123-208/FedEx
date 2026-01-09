import React from 'react';
import { motion } from 'framer-motion';

const Timeline = ({ timeline }) => {
    return (
        <div className="relative pl-4 border-l border-[#DDDDDD] space-y-8 my-4">
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
                        ? 'bg-brand-500 border-brand-500 shadow-[0_0_10px_rgba(77,20,140,0.4)]'
                        : 'bg-[#EEEEEE] border-[#BBBBBB]'
                        }`}></div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <h4 className={`text-sm font-semibold ${item.completed ? 'text-[#222222]' : 'text-[#777777]'}`}>
                            {item.status}
                        </h4>
                        <span className="text-xs font-mono text-[#555555] bg-[#F5F5F5] px-2 py-0.5 rounded border border-[#DDDDDD]">
                            {item.date}
                        </span>
                    </div>
                    <p className="text-sm text-[#555555]">{item.location}</p>
                </motion.div>
            ))}
        </div>
    );
};

export default Timeline;
