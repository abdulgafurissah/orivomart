
import { getSession } from '@/utils/session';
import { prisma } from '@/utils/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CustomerOrdersPage() {
    const session = await getSession();
    if (!session) redirect('/auth/signin');

    const myOrders = await prisma.order.findMany({
        where: { buyerId: session.userId },
        include: {
            items: {
                include: {
                    seller: {
                        select: { shopName: true }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="container" style={{ padding: '4rem 1rem', minHeight: '80vh' }}>
            <h1 style={{ marginBottom: '2rem' }}>My Orders</h1>

            {!myOrders || myOrders.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '1rem' }}>No orders yet</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Looks like you haven't bought anything yet.</p>
                    <Link href="/" className="btn btn-primary">Start Shopping</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {myOrders.map(order => (
                        <div key={order.id} className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)' }}>
                                <div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Order Placed</div>
                                    <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total</div>
                                    <div style={{ fontWeight: 'bold' }}>{order.currency} {Number(order.totalAmount).toLocaleString()}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Order ID</div>
                                    <div style={{ fontFamily: 'monospace' }}>#{order.id.slice(0, 8)}</div>
                                </div>
                            </div>

                            <div style={{ padding: '1.5rem' }}>
                                {order.items.map((item: any) => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{ width: '80px', height: '80px', background: '#333', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                                                Img
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.productName || 'Independent Item'}</h3>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sold by: {item.seller?.shopName || 'External/Direct'}</div>
                                                <div style={{ marginTop: '0.5rem' }}>
                                                    <span style={{
                                                        padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem',
                                                        background: 'rgba(255,255,255,0.1)'
                                                    }}>
                                                        Status: {(item.deliveryStatus || 'pending').replace('_', ' ').toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ textAlign: 'right' }}>
                                            {item.trackingCode ? (
                                                <Link href={`/track?q=${item.trackingCode}`} className="btn btn-secondary" style={{ fontSize: '0.9rem' }}>
                                                    Track Package
                                                </Link>
                                            ) : (
                                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                                    Processing...
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
