'use client';

import { useEffect, useState } from 'react';


import Link from 'next/link';

export default function AdminOverview() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalSellers: 0,
        pendingSellers: 0,
        totalProducts: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            const { getAdminStats } = await import('@/app/actions/admin-actions');
            const res = await getAdminStats();

            if (res && !res.error) {
                setStats({
                    totalUsers: res.totalUsers || 0,
                    totalSellers: res.totalSellers || 0,
                    pendingSellers: res.pendingSellers || 0,
                    totalProducts: res.totalProducts || 0
                });
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Dashboard Overview</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {/* Stat 1 */}
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Users</span>
                    <span style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{stats.totalUsers}</span>
                    <span style={{ fontSize: '0.8rem', color: '#2ecc71' }}>+ Active Platform Users</span>
                </div>

                {/* Stat 2 */}
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Shops</span>
                    <span style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{stats.totalSellers}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Registered Businesses</span>
                </div>

                {/* Stat 3 */}
                <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', borderLeft: stats.pendingSellers > 0 ? '4px solid #f39c12' : 'none' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pending verifications</span>
                    <span style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{stats.pendingSellers}</span>
                    {stats.pendingSellers > 0 && (
                        <Link href="/admin/sellers" style={{ fontSize: '0.8rem', color: '#f39c12', textDecoration: 'underline' }}>
                            Action Required ↗
                        </Link>
                    )}
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>System Status</h3>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <div>
                        <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#2ecc71', marginRight: '8px' }}></span>
                        Database Connected
                    </div>
                    <div>
                        <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#2ecc71', marginRight: '8px' }}></span>
                        Payments (Paystack) Active
                    </div>
                    <div>
                        <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#2ecc71', marginRight: '8px' }}></span>
                        Storage Active
                    </div>
                </div>
            </div>
        </div>
    );
}
