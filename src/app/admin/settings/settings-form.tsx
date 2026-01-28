'use client';

import { useState } from 'react';
import { updateAdminProfile, changeAdminPassword } from '@/app/actions/admin-settings-actions';

interface SettingsFormProps {
    user: {
        email: string;
        fullName: string | null;
    };
}

export default function SettingsForm({ user }: SettingsFormProps) {
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleProfileUpdate(formData: FormData) {
        setIsLoading(true);
        setMessage(null);

        const res = await updateAdminProfile(formData);

        setIsLoading(false);
        if (res?.error) {
            setMessage({ type: 'error', text: res.error });
        } else if (res?.success) {
            setMessage({ type: 'success', text: res.success });
        }
    }

    async function handlePasswordChange(formData: FormData) {
        setIsLoading(true);
        setMessage(null);

        const res = await changeAdminPassword(formData);

        setIsLoading(false);
        if (res?.error) {
            setMessage({ type: 'error', text: res.error });
            // Don't clear form automatically as it might be annoying, but for password usually good to clear.
        } else if (res?.success) {
            setMessage({ type: 'success', text: res.success });
            // Reset form manually if needed
            (document.getElementById('passwordForm') as HTMLFormElement)?.reset();
        }
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Settings</h1>

            {message && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: message.type === 'error' ? 'rgba(231, 76, 60, 0.2)' : 'rgba(46, 204, 113, 0.2)',
                    border: `1px solid ${message.type === 'error' ? '#e74c3c' : '#2ecc71'}`,
                    color: message.type === 'error' ? '#e74c3c' : '#2ecc71'
                }}>
                    {message.text}
                </div>
            )}

            {/* Profile Info Section */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                    Profile Information
                </h2>
                <form action={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Name</label>
                            <input
                                name="fullName"
                                type="text"
                                placeholder="Admin Name"
                                defaultValue={user.fullName || ''}
                                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email Address</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="admin@orivomart.com"
                                defaultValue={user.email}
                                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }}
                            />
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <button disabled={isLoading} type="submit" className="btn btn-primary">
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Security Section */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                    Security
                </h2>
                <form id="passwordForm" action={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Current Password</label>
                        <input
                            name="currentPassword"
                            type="password"
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>New Password</label>
                            <input
                                name="newPassword"
                                type="password"
                                required
                                minLength={6}
                                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Confirm New Password</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                minLength={6}
                                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }}
                            />
                        </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <button disabled={isLoading} type="submit" className="btn btn-primary" style={{ background: '#e74c3c' }}>
                            {isLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
