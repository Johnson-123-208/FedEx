import React from 'react';

/**
 * Status Badge component for shipment status display
 * @param {Object} props - Component props
 * @param {string} props.status - Status value
 * @param {string} props.size - Badge size (sm/md/lg)
 */
const StatusBadge = ({ status, size = 'md' }) => {
    const getStatusClass = (status) => {
        const statusLower = status.toLowerCase().replace(/_/g, '-');
        switch (statusLower) {
            case 'delivered':
                return 'status-delivered';
            case 'in-transit':
            case 'in transit':
                return 'status-in-transit';
            case 'pending':
                return 'status-pending';
            case 'delayed':
                return 'status-delayed';
            case 'out-for-delivery':
            case 'out for delivery':
                return 'status-out-for-delivery';
            default:
                return 'status-pending';
        }
    };

    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2',
    };

    const formatStatus = (status) => {
        return status.replace(/_/g, ' ').toUpperCase();
    };

    return (
        <span className={`status-badge ${getStatusClass(status)} ${sizeClasses[size]}`}>
            {formatStatus(status)}
        </span>
    );
};

export default StatusBadge;
