'use client';

import { useEffect, useState } from 'react';
import { getAllOrders } from '@/app/actions/admin-actions';

// Minimal types adhering to UI use, can import from Prisma but doing locally for simplicity in client
type OrderItem = {
    id: string;
    productName: string;
    quantity: number;
    price: any; // Decimal
    sellerId: string;
    trackingCode: string | null;
    deliveryStatus: string;
};

type Order = {
    id: string;
    createdAt: Date | string;
    totalAmount: any; // Decimal
    currency: string;
    status: string;
    paymentReference: string | null;
    buyerId: string | null;
    shippingDetails: any;
    items: OrderItem[];
};

export default function AdminTransactionsPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const res = await getAllOrders();

        if (res.data) {
            setOrders(res.data as any[]); // Type cast if Date/Decimal mismatch
        } else {
            console.error('Error fetching orders:', res.error);
        }
        setLoading(false);
    };

    if (loading) {
        return <div className="p-8 text-center">Loading transactions...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Transactions & Orders</h1>
                <button onClick={fetchOrders} className="btn btn-secondary">Refresh</button>
            </div>

            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)' }}>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Order ID</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Customer</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Total</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Payment Ref</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Items</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No transactions found.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => {
                                const details = typeof order.shippingDetails === 'string' ? JSON.parse(order.shippingDetails) : order.shippingDetails;
                                const email = details?.email || order.buyerId || 'Guest';

                                return (
                                    <tr key={order.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                        <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{order.id.slice(0, 8)}...</td>
                                        <td style={{ padding: '1rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem' }}>
                                            {email}
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                                            {order.currency} {Number(order.totalAmount).toFixed(2)}
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{order.paymentReference || 'N/A'}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                background: order.status === 'paid' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)',
                                                color: order.status === 'paid' ? '#2ecc71' : '#e74c3c',
                                                textTransform: 'capitalize'
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                {order.items.map(item => (
                                                    <div key={item.id} style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span>{item.quantity}x {item.productName}</span>
                                                        <span style={{
                                                            fontSize: '0.75rem',
                                                            background: 'rgba(255,255,255,0.1)',
                                                            padding: '2px 4px',
                                                            borderRadius: '3px'
                                                        }}>
                                                            {item.deliveryStatus.replace('_', ' ')}
                                                        </span>
                                                        {item.trackingCode && (
                                                            <span title="Tracking Code" style={{ cursor: 'help', fontFamily: 'monospace' }}>
                                                                📍 {item.trackingCode}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
