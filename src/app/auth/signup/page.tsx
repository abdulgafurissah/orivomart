'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SellerSignup() {
    const [formData, setFormData] = useState({
        details: '',
        shopName: '',
        ownerName: '',
        email: '',
        phone: '',
        accountNumber: '',
        bankName: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // API call would go here
        alert('Application submitted! Pending admin approval.');
    };

    return (
        <div className="container" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2.5rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>Become a Seller</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Join Agifarmz and reach thousands of farmers. Your store will be live after admin verification.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Shop Name</label>
                            <input
                                required
                                type="text"
                                className="input-field"
                                placeholder="e.g. Green Harvest"
                                value={formData.shopName}
                                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Owner Name</label>
                            <input
                                required
                                type="text"
                                placeholder="Your Full Name"
                                value={formData.ownerName}
                                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
                        <input
                            required
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Payment Details (Paystack Integration)</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                            <input
                                required
                                type="text"
                                placeholder="Bank Name"
                                value={formData.bankName}
                                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }}
                            />
                            <input
                                required
                                type="text"
                                placeholder="Account Number"
                                value={formData.accountNumber}
                                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }}
                            />
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                            * We use Paystack to route payments directly to your account.
                        </p>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Submit Application
                    </button>
                </form>

                <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Already have a shop? <Link href="/auth/signin" style={{ color: 'var(--primary)' }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
}
