
import { getSellerSales } from '@/app/actions/sales-actions';
import Link from 'next/link';

import OrderAction from './OrderAction';

export const dynamic = 'force-dynamic';

export default async function SalesPage() {
    const sales = await getSellerSales();

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', margin: 0 }}>My Sales</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>View your orders and earnings</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        GH₵ {sales.reduce((acc, item) => acc + Number(item.price), 0).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#2ecc71' }}>Total Revenue</div>
                </div>
            </div>

            {sales.length === 0 ? (
                <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
                    <h2>No sales yet 📉</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>List more products to start selling!</p>
                </div>
            ) : (
                <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--card-border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                                    <th style={{ padding: '1rem' }}>Date</th>
                                    <th style={{ padding: '1rem' }}>Product</th>
                                    <th style={{ padding: '1rem' }}>Buyer</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                    <th style={{ padding: '1rem' }}>Earnings</th>
                                    <th style={{ padding: '1rem' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.map(item => {
                                    const details = item.order?.shippingDetails ?
                                        (typeof item.order.shippingDetails === 'string' ? JSON.parse(item.order.shippingDetails) : item.order.shippingDetails) : null;

                                    return (
                                        <tr key={item.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                                            <td style={{ padding: '1rem' }}>
                                                {new Date(item.createdAt).toLocaleDateString()}
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                    {new Date(item.createdAt).toLocaleTimeString()}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: 'bold' }}>{item.productName}</div>
                                                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Qty: {item.quantity}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div>{item.order?.buyer?.fullName || details?.receiver?.name || 'Guest'}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                    {details?.address || 'Pickup'}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600',
                                                    background: item.deliveryStatus === 'delivered' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(241, 196, 15, 0.2)',
                                                    color: item.deliveryStatus === 'delivered' ? '#2ecc71' : '#f1c40f'
                                                }}>
                                                    {item.deliveryStatus.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                                GH₵ {Number(item.price).toFixed(2)}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <OrderAction itemId={item.id} currentStatus={item.deliveryStatus} />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
