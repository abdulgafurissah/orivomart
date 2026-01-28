'use client';

import { useState } from 'react';
import { updateOrderItemStatus } from '@/app/actions/sales-actions';

export default function OrderAction({ itemId, currentStatus }: { itemId: string, currentStatus: string }) {
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (status: string) => {
        if (!confirm(`Mark this order as ${status}?`)) return;
        setLoading(true);
        try {
            const res = await updateOrderItemStatus(itemId, status);
            if (res.error) alert(res.error);
        } catch (e) {
            alert('Failed to update');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <span style={{ fontSize: '0.8rem' }}>Updating...</span>;

    if (currentStatus === 'pending_pickup' || currentStatus === 'pending') {
        return (
            <button
                onClick={() => handleUpdate('ready_for_pickup')}
                className="btn btn-primary"
                style={{ fontSize: '0.7rem', padding: '4px 8px' }}
            >
                Mark Ready
            </button>
        );
    }

    if (currentStatus === 'ready_for_pickup') {
        return <span style={{ fontSize: '0.8rem', color: '#f39c12' }}>Waiting for Courier</span>;
    }

    if (currentStatus === 'out_for_delivery') {
        return <span style={{ fontSize: '0.8rem', color: '#3498db' }}>Out for Delivery</span>;
    }

    if (currentStatus === 'delivered') {
        return <span style={{ fontSize: '0.8rem', color: '#2ecc71' }}>Completed</span>;
    }

    return null;
}
