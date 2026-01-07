import React from 'react';
import { motion } from 'framer-motion';

/**
 * Timeline component for shipment tracking
 * @param {Object} props - Component props
 * @param {Array} props.timeline - Timeline data array
 */
const Timeline = ({ timeline }) => {
    return (
        <div className="space-y-6">
            {timeline.map((item, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="timeline-item"
                >
                    <div className={`timeline-dot ${item.completed ? 'completed' : ''}`}>
                        {item.completed && (
                            <svg className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>

                    <div className={`ml-8 ${item.completed ? 'opacity-100' : 'opacity-50'}`}>
                        <div className="flex items-start justify-between mb-1">
                            <h4 className={`font-semibold ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                                {item.status}
                            </h4>
                            <span className="text-xs text-gray-500">{item.date}</span>
                        </div>
                        <p className="text-sm text-gray-600">{item.location}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default Timeline;
