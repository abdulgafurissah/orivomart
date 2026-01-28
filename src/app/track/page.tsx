

import Link from 'next/link';

export default async function TrackOrderPage({
    searchParams,
}: {
    searchParams?: { q?: string };
}) {
    const query = searchParams?.q || '';
    let trackingResult = null;
    let error = null;

    if (query) {
        const { prisma } = await import('@/utils/prisma');

        try {
            // Search by trackingCode
            const item = await prisma.orderItem.findFirst({
                where: { trackingCode: query },
                include: {
                    order: true,
                    seller: {
                        select: { shopName: true }
                    }
                }
            });

            if (!item) {
                error = 'Tracking ID not found. Please check and try again.';
            } else {
                trackingResult = {
                    ...item,
                    order: item.order,
                    seller: { shop_name: item.seller?.shopName }, // Map to match existing UI structure expecting snake_case or adapt UI
                    delivery_status: item.deliveryStatus,
                    tracking_code: item.trackingCode,
                    product_name: item.productName,
                };
                // NOTE: The UI uses snake_case properties from Supabase result. 
                // We mapped specific fields back to what the UI expects below or in the object above.
                // Or better, I should update the UI usage below.
                // Let's rely on standard Prisma camelCase but for now mapped manually to avoid UI breakages in one go.
            }
        } catch (e) {
            console.error('Tracking Error', e);
            error = 'System error occurred.';
        }
    }

    return (
        <div className="container" style={{ padding: '4rem 1rem', minHeight: '60vh', maxWidth: '800px' }}>
            <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Track Your Order</h1>

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem' }}>
                <form method="GET" action="/track" style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        name="q"
                        defaultValue={query}
                        placeholder="Enter Tracking ID (e.g. TRK-123...)"
                        required
                        style={{
                            flex: 1,
                            padding: '12px 20px',
                            fontSize: '1.1rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--glass-border)',
                            background: 'rgba(0,0,0,0.3)',
                            color: 'white'
                        }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '12px 30px' }}>
                        Track
                    </button>
                </form>
            </div>

            {error && (
                <div style={{ textAlign: 'center', color: '#e74c3c', padding: '2rem', background: 'rgba(231, 76, 60, 0.1)', borderRadius: 'var(--radius-md)' }}>
                    {error}
                </div>
            )}

            {trackingResult && (
                <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{trackingResult.delivery_status.replace('_', ' ').toUpperCase()}</h2>
                                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                    Tracking ID: <span style={{ fontFamily: 'monospace', color: 'white' }}>{trackingResult.tracking_code}</span>
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Estimated Delivery</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>3-5 Business Days</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '2rem' }}>
                        {/* Progress Bar */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <span>Order Placed</span>
                            <span>Processing</span>
                            <span>In Transit</span>
                            <span>Delivered</span>
                        </div>
                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '2rem' }}>
                            <div style={{
                                height: '100%',
                                background: 'var(--primary)',
                                width:
                                    trackingResult.delivery_status === 'delivered' ? '100%' :
                                        trackingResult.delivery_status === 'in_transit' ? '75%' :
                                            trackingResult.delivery_status === 'pending_pickup' ? '50%' :
                                                '25%'
                            }}></div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Item Details</h3>
                                <p style={{ fontWeight: 'bold' }}>{trackingResult.product_name}</p>
                                <p style={{ fontSize: '0.9rem' }}>Qty: {trackingResult.quantity}</p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>Sold by {trackingResult.seller?.shop_name}</p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Shipping To</h3>
                                <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    {trackingResult.order?.shippingDetails ? (
                                        typeof trackingResult.order.shippingDetails === 'string'
                                            ? JSON.parse(trackingResult.order.shippingDetails).address
                                            : (trackingResult.order.shippingDetails as any).address
                                    ) : 'Address not available'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>Back to Home</Link>
            </div>
        </div>
    );
}
