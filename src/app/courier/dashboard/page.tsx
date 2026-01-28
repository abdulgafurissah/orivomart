import { getCourierDeliveries } from '@/app/actions/delivery-actions';
import CourierAction from './CourierAction';

export const dynamic = 'force-dynamic';

export default async function CourierDashboard() {
    const deliveries = await getCourierDeliveries();

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>My Deliveries</h1>

            {deliveries.length === 0 ? (
                <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
                    <h2>No deliveries assigned yet 🛵</h2>
                </div>
            ) : (
                <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--card-border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                                    <th style={{ padding: '1rem' }}>Date</th>
                                    <th style={{ padding: '1rem' }}>Pickup Details</th>
                                    <th style={{ padding: '1rem' }}>Delivery To</th>
                                    <th style={{ padding: '1rem' }}>Item</th>
                                    <th style={{ padding: '1rem' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deliveries.map(item => {
                                    const details = item.order?.shippingDetails ?
                                        (typeof item.order.shippingDetails === 'string' ? JSON.parse(item.order.shippingDetails) : item.order.shippingDetails) : null;

                                    return (
                                        <tr key={item.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                                            <td style={{ padding: '1rem' }}>
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: 'bold' }}>{item.seller?.shopName}</div>
                                                <div style={{ fontSize: '0.8rem' }}>{item.seller?.businessAddress}</div>
                                                {item.seller?.phone && <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>📞 {item.seller.phone}</div>}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: 'bold' }}>{item.order?.buyer?.fullName || details?.receiver?.name || 'Guest'}</div>
                                                <div style={{ fontSize: '0.8rem' }}>{details?.address || details?.receiver?.address}</div>
                                                {details?.gpsAddress && <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>📍 {details.gpsAddress}</div>}
                                                {(details?.phone || details?.receiver?.phone) && <div style={{ fontSize: '0.8rem' }}>📞 {details?.phone || details.receiver.phone}</div>}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                {item.productName}
                                                <div style={{ fontSize: '0.8rem' }}>Qty: {item.quantity}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <CourierAction itemId={item.id} currentStatus={item.deliveryStatus} />
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                                    {item.deliveryStatus.toUpperCase()}
                                                </div>
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
