'use client';

import { useState } from 'react';
import { updateCourierDeliveryStatus } from '@/app/actions/delivery-actions';

export default function CourierAction({ itemId, currentStatus }: { itemId: string, currentStatus: string }) {
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (status: string) => {
        if (!confirm(`Update status to ${status}?`)) return;
        setLoading(true);
        try {
            const res = await updateCourierDeliveryStatus(itemId, status);
            if (res.error) alert(res.error);
        } catch (e) {
            alert('Failed to update');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <span style={{ fontSize: '0.8rem' }}>Updating...</span>;

    if (currentStatus === 'pending_pickup') {
        return <span style={{ fontSize: '0.8rem', color: '#f39c12' }}>Waiting for Pickup</span>;
    }

    // If shop marked it ready
    if (currentStatus === 'ready_for_pickup') {
        return (
            <button
                onClick={() => handleUpdate('out_for_delivery')}
                className="btn btn-primary"
                style={{ fontSize: '0.7rem', padding: '4px 8px' }}
            >
                Pick Up & Start Delivery
            </button>
        );
    }

    if (currentStatus === 'out_for_delivery') {
        return (
            <button
                onClick={() => handleUpdate('delivered')}
                className="btn btn-primary"
                style={{ fontSize: '0.7rem', padding: '4px 8px', background: '#2ecc71', borderColor: '#27ae60' }}
            >
                Mark Delivered
            </button>
        );
    }

    if (currentStatus === 'delivered') {
        return <span style={{ fontSize: '0.8rem', color: '#2ecc71' }}>Completed</span>;
    }

    return <span style={{ fontSize: '0.8rem' }}>{currentStatus}</span>;
}
