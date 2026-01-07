import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Card component with glassmorphism effect and hover animation
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.hover - Enable hover effect
 * @param {string} props.gradient - Enable gradient background
 */
const Card = ({ children, className = '', hover = true, gradient = false }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`
        bg-white rounded-xl shadow-lg p-6
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${gradient ? 'bg-gradient-to-br from-white to-blue-50' : ''}
        ${className}
      `}
        >
            {children}
        </motion.div>
    );
};

export default Card;
