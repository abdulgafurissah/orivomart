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

    if (loading) return <span style={{ fontSize: '0.8rem' }}>Processing...</span>;

    const { deleteOrderItem } = require('@/app/actions/sales-actions'); // Dynamic import to avoid client bundle issues if needed, or just import at top if server actions are compatible. 
    // Actually, server actions can be imported at top.

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to DELETE this order record? This cannot be undone.')) return;
        setLoading(true);
        // We need to import deleteOrderItem dynamically or pass it. 
        // For simplicity in this file, we assume standard import at top works or we use the passed prop if we refactored. 
        // Let's rely on top-level imports that Next.js handles for server actions.
    };

    // Status color helper
    const getStatusColor = (s: string) => {
        switch (s) {
            case 'pending': return '#f1c40f'; // yellow
            case 'ready_for_pickup': return '#3498db'; // blue
            case 'out_for_delivery': return '#9b59b6'; // purple
            case 'delivered': return '#2ecc71'; // green
            case 'suspended': return '#e74c3c'; // red
            default: return '#95a5a6'; // gray
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span style={{
                fontSize: '0.75rem',
                fontWeight: 'bold',
                color: getStatusColor(currentStatus),
                textTransform: 'uppercase'
            }}>
                {currentStatus.replace(/_/g, ' ')}
            </span>

            <div style={{ display: 'flex', gap: '5px' }}>
                {(currentStatus === 'pending' || currentStatus === 'pending_pickup') && (
                    <button
                        onClick={() => handleUpdate('ready_for_pickup')}
                        className="btn"
                        style={{ fontSize: '0.7rem', padding: '2px 6px', background: '#3498db', color: 'white' }}
                        title="Mark Ready for Pickup"
                    >
                        Ready
                    </button>
                )}

                {currentStatus !== 'delivered' && currentStatus !== 'suspended' && (
                    <button
                        onClick={() => handleUpdate('suspended')}
                        className="btn"
                        style={{ fontSize: '0.7rem', padding: '2px 6px', background: '#e67e22', color: 'white' }}
                        title="Suspend Order"
                    >
                        Suspend
                    </button>
                )}

                <button
                    onClick={async () => {
                        if (!confirm('DELETE this order? This will remove it from your record permanently.')) return;
                        setLoading(true);
                        // Dynamic import hack if top-level fails, or just use `deleteOrderItem` if imported at top (which I will add)
                        const { deleteOrderItem } = await import('@/app/actions/sales-actions');
                        try {
                            await deleteOrderItem(itemId);
                        } catch (e) { alert('Failed to delete'); }
                        setLoading(false);
                    }}
                    className="btn"
                    style={{ fontSize: '0.7rem', padding: '2px 6px', background: '#c0392b', color: 'white' }}
                    title="Delete Record"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
