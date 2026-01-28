'use client';

import { useState } from 'react';
import Link from 'next/link';
import { login } from '@/app/actions/auth-actions';

export default function SignIn() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        const result = await login(formData);

        if (result?.error) {
            const msg = typeof result.error === 'string' ? result.error : JSON.stringify(result.error);
            alert(msg);
            setIsLoading(false);
        }
    };

    return (
        <div className="container" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>Welcome Back</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Sign in to your OrivoMart account
                </p>

                <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
                        <input
                            required
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
                        <input
                            required
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }}
                        />
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <a href="#" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Forgot password?</a>
                    </div>

                    <button disabled={isLoading} type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', opacity: isLoading ? 0.7 : 1 }}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                    <p style={{ marginBottom: '1rem' }}>
                        New Seller? <Link href="/auth/signup" style={{ color: 'var(--primary)' }}>Start Selling</Link>
                    </p>
                    <p>
                        New Buyer? <Link href="/auth/signup-buyer" style={{ color: 'var(--accent)' }}>Create Buyer Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
