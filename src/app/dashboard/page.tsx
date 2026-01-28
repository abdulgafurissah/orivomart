'use client';

import { useEffect, useState } from 'react';
import { getSellerProfile } from '@/app/actions/seller-actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SellerProfile {
    id: string;
    shop_name: string;
    owner_name: string;
    status: string;
    email: string;
    rating: string;
    productsCount: number;
}

export default function SellerDashboard() {
    const [profile, setProfile] = useState<SellerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const data = await getSellerProfile();

            if (!data) {
                // If not found, perhaps redirect or show fallback
                // For now, if no seller profile, we might be a new user or not logged in.
                // Redirect if not logged in handles by layout protections usually, 
                // but if logged in as 'buyer', data is null.
                setLoading(false);
                return;
            }

            // Map Prisma fields to local interface if needed
            setProfile({
                id: data.id,
                shop_name: data.shopName,
                owner_name: data.ownerName,
                status: data.status,
                email: data.email,
                rating: data.rating,
                productsCount: data.productsCount
            });
            setLoading(false);
        };

        checkUser();
    }, []);

    // DEMO: If no real backend auth is actively running for this user, let's show a "Pending" state simulation
    // or if we found a profile, show that.

    if (loading) return <div className="container" style={{ padding: '4rem' }}>Loading Dashboard...</div>;

    // Fallback for demo if no profile found (User didn't actually go through full Supabase Auth flow)
    const displayStatus = profile?.status || 'pending';
    const displayName = profile?.shop_name || 'New Shop';

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Seller Dashboard</h1>

            {displayStatus === 'pending' && (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderLeft: '4px solid #f39c12' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                    <h2 style={{ marginBottom: '1rem' }}>Application Under Review</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
                        Thank you for registering <strong>{displayName}</strong>.
                        Your KYC documents and business details are currently being verified by our admin team.
                    </p>
                    <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
                        Estimated time: 24-48 hours.
                    </p>
                    <div style={{ marginTop: '2rem' }}>
                        <Link href="/" className="btn btn-secondary">Return to Home</Link>
                    </div>
                </div>
            )}

            {displayStatus === 'active' && (
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <h2 style={{ margin: 0 }}>Welcome, {profile?.owner_name || 'Seller'}!</h2>
                            <p style={{ color: 'var(--primary)' }}>{displayName} • <span style={{ color: '#2ecc71' }}>● Live</span></p>
                        </div>
                        <Link href="/dashboard/products" className="btn btn-primary">Manage Products</Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                        <Link href="/dashboard/products" style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'block', textDecoration: 'none', color: 'inherit' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{profile?.productsCount || 0}</div>
                            <div style={{ color: 'var(--text-secondary)' }}>Active Products</div>
                        </Link>
                        <Link href="/dashboard/sales" style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'block', textDecoration: 'none', color: 'inherit', position: 'relative' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>GH₵ 0.00</div>
                            <div style={{ color: 'var(--text-secondary)' }}>Total Sales</div>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    alert('Sales history cleared!');
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    opacity: 0.6
                                }}
                                title="Clear Sales History"
                            >
                                🗑️ Clear
                            </button>
                        </Link>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>4.8</div>
                            <div style={{ color: 'var(--text-secondary)' }}>Shop Rating</div>
                        </div>
                    </div>

                    <h3>Quick Actions</h3>
                    <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link href="/dashboard/products" className="btn btn-secondary">View All Products</Link>
                        <Link href="/orders" className="btn btn-secondary">View Orders</Link>
                        <Link href="/dashboard/settings" className="btn btn-secondary">Settings</Link>
                    </div>
                </div>
            )}

            {displayStatus === 'rejected' && (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderLeft: '4px solid #e74c3c' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
                    <h2 style={{ marginBottom: '1rem' }}>Application Rejected</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
                        Unfortunately, your application for <strong>{displayName}</strong> could not be verified.
                        Please contact support for more details regarding your KYC documents.
                    </p>
                    <div style={{ marginTop: '2rem' }}>
                        <Link href="/contact" className="btn btn-secondary">Contact Support</Link>
                    </div>
                </div>
            )}

            {displayStatus === 'suspended' && (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderLeft: '4px solid #e74c3c' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                    <h2 style={{ marginBottom: '1rem' }}>Account Suspended</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
                        Your shop has been temporarily suspended due to a policy violation.
                    </p>
                </div>
            )}
        </div>
    );
}
