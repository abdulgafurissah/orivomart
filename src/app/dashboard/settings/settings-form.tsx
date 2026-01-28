'use client';

import { useState } from 'react';
import { updateSellerSettings } from '@/app/actions/seller-actions';

interface SettingsFormProps {
    seller: any;
    email: string; // Passed from profile
}

export default function SettingsForm({ seller, email }: SettingsFormProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setMessage(null);

        const formData = new FormData(event.currentTarget);
        const result = await updateSellerSettings(formData);

        if (result.error) {
            setMessage({ type: 'error', text: result.error });
        } else if (result.success) {
            setMessage({ type: 'success', text: result.success });
            // Optionally reset sensitive fields
            const form = event.target as HTMLFormElement;
            const passwordInput = form.querySelector('input[name="newPassword"]') as HTMLInputElement;
            const currentPasswordInput = form.querySelector('input[name="currentPassword"]') as HTMLInputElement;
            if (passwordInput) passwordInput.value = '';
            if (currentPasswordInput) currentPasswordInput.value = '';
        }

        setLoading(false);
    }

    return (
        <form onSubmit={handleSubmit} className="animate-fade-in" style={{ maxWidth: '800px' }}>

            {message && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    borderRadius: 'var(--radius-md)',
                    background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                    color: message.type === 'success' ? '#166534' : '#991b1b',
                    border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                }}>
                    {message.text}
                </div>
            )}

            {/* Shop Information Section */}
            <section className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
                    🏪 Shop Profile
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Shop Logo / Image</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img
                                src={seller.image || 'https://placehold.co/60'}
                                alt="Shop Logo"
                                onError={(e) => { e.currentTarget.src = 'https://placehold.co/60?text=Shop'; }}
                                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <input
                                name="shopImage"
                                type="file"
                                accept="image/*"
                                style={{ padding: '10px 0' }}
                            />
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            Your avatar/logo (Square, 1:1)
                        </p>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Shop Cover / Banner</label>
                        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <div style={{ width: '100%', height: '100px', background: '#333', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                                <img
                                    src={seller.coverImage || 'https://placehold.co/600x200?text=Cover+Image'}
                                    alt="Shop Cover"
                                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x200?text=Cover+Image'; }}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <input
                                name="coverImage"
                                type="file"
                                accept="image/*"
                                style={{ padding: '10px 0', width: '100%' }}
                            />
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            A wide banner image to represent your shop (Recommended: 1200x400)
                        </p>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Shop Name</label>
                        <input
                            name="shopName"
                            defaultValue={seller.shopName}
                            placeholder="e.g. Sahal Electronics"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                        />
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            Your unique shop link will rely on this name.
                        </p>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Owner Name</label>
                        <input
                            name="ownerName"
                            defaultValue={seller.ownerName} // This is synced with profile.fullName
                            placeholder="Your Full Name"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                        />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Description</label>
                        <textarea
                            name="description"
                            defaultValue={seller.description || ''}
                            placeholder="Tell customers about your shop..."
                            rows={4}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                        />
                    </div>

                </div>
            </section>

            {/* Contact Information */}
            <section className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
                    📱 Contact Details
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Phone Number</label>
                        <input
                            name="phone"
                            defaultValue={seller.phone || ''}
                            placeholder="+233..."
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>City</label>
                        <input
                            name="city"
                            defaultValue={seller.city || ''}
                            placeholder="Accra"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                        />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Full Address</label>
                        <input
                            name="address"
                            defaultValue={seller.address || ''}
                            placeholder="Street Name, Building No."
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                        />
                    </div>
                </div>
            </section>

            {/* Account Security */}
            <section className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', color: 'var(--primary)' }}>
                    🔐 Account & Security
                </h2>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Email Address</label>
                    <input
                        name="email"
                        type="email"
                        defaultValue={email}
                        placeholder="you@example.com"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>New Password (Optional)</label>
                        <input
                            name="newPassword"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Leave blank to keep current"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Current Password</label>
                        <input
                            name="currentPassword"
                            type="password"
                            placeholder="Only if changing email/password"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}
                        />
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            Required only if you are changing your email or password.
                        </p>
                    </div>
                </div>
            </section>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Danger Zone */}
            <section className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid #fee2e2' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', borderBottom: '1px solid #fecaca', paddingBottom: '0.5rem', color: '#dc2626' }}>
                    🚨 Danger Zone
                </h2>

                <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    Deleting your account is permanent. All your products, sales history, and shop data will be wiped immediately.
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: '#991b1b' }}>Permanently Delete Account</span>
                    <button
                        type="button"
                        onClick={async () => {
                            if (confirm('Are you absolutely sure accessing this will wipe your entire shop? This action cannot be undone.')) {
                                setLoading(true);
                                const { deleteAccount } = await import('@/app/actions/auth-actions');
                                const res = await deleteAccount();
                                if (res.success) {
                                    window.location.href = '/';
                                } else {
                                    setMessage({ type: 'error', text: res.error || 'Failed to delete' });
                                    setLoading(false);
                                }
                            }
                        }}
                        className="btn"
                        style={{
                            background: '#dc2626',
                            color: 'white',
                            border: 'none',
                            fontSize: '0.9rem'
                        }}
                    >
                        Delete My Account
                    </button>
                </div>
            </section>
        </form>
    );
}
