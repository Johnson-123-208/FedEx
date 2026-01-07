import React from 'react';

const StatusBadge = ({ status, size = 'md' }) => {
    const getStatusClass = (status) => {
        const s = status.toLowerCase().replace(/[\s_]+/g, '-');
        if (s.includes('delivered')) return 'badge-success';
        if (s.includes('transit')) return 'badge-info';
        if (s.includes('out-for')) return 'badge-warning';
        if (s.includes('delay') || s.includes('fail') || s.includes('cancel')) return 'badge-error';
        return 'badge-info';
    };

    const sizeClasses = {
        sm: 'text-2xs px-2 py-0.5',
        md: 'text-xs px-2.5 py-1',
        lg: 'text-sm px-3 py-1.5',
    };

    return (
        <span className={`badge ${getStatusClass(status)} ${sizeClasses[size]}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
            {status.replace(/_/g, ' ')}
        </span>
    );
};

export default StatusBadge;
