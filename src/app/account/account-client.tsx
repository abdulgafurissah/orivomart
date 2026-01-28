'use client';

import { useState } from 'react';
import { updateSellerSettings } from '@/app/actions/seller-actions'; // We can reuse or make a generic one.
// Actually, let's make a generic client component for account management.

export default function AccountClient({ user }: { user: any }) {
    const [loading, setLoading] = useState(false);

    // Reuse server action logic?
    // We don't have a generic "updateUser" action yet, only updateSellerSettings.
    // I'll stick to just Delete Account for this generic page to satisfy the immediate "clear dashboard" request.

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', maxWidth: '600px' }}>
            <h1 style={{ marginBottom: '2rem' }}>My Account</h1>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Name</label>
                    <div style={{ padding: '10px', background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)' }}>
                        {user.fullName || 'User'}
                    </div>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email</label>
                    <div style={{ padding: '10px', background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)' }}>
                        {user.email}
                    </div>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Role</label>
                    <div style={{ padding: '10px', background: 'var(--input-bg)', borderRadius: 'var(--radius-sm)', textTransform: 'capitalize' }}>
                        {user.role}
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem', border: '1px solid #fee2e2' }}>
                <h2 style={{ marginBottom: '1rem', color: '#dc2626' }}>Delete Account</h2>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    This will permanently delete your account and all associated data.
                </p>
                <button
                    onClick={async () => {
                        if (confirm('Are you sure you want to delete your account?')) {
                            setLoading(true);
                            const { deleteAccount } = await import('@/app/actions/auth-actions');
                            await deleteAccount();
                            window.location.href = '/';
                        }
                    }}
                    className="btn"
                    style={{ background: '#dc2626', color: 'white', border: 'none', width: '100%' }}
                    disabled={loading}
                >
                    {loading ? 'Deleting...' : 'Delete My Account'}
                </button>
            </div>
        </div>
    );
}
