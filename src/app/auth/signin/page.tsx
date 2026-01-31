'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { login } from '@/app/actions/auth-actions';

import styles from '../auth.module.css';

export default function SignIn() {
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        const result = await login(formData);

        if (result?.error) {
            const msg = typeof result.error === 'string' ? result.error : JSON.stringify(result.error);
            addToast(msg, 'error');
            setIsLoading(false);
        }
    };

    return (
        <div className={`container ${styles.container}`}>
            <div className={`glass-panel ${styles.authPanel}`}>
                <h2 className={styles.title}>Welcome Back</h2>
                <p className={styles.subtitle}>
                    Sign in to your OrivoMart account
                </p>

                <form action={handleSubmit} className={styles.form}>
                    <div>
                        <label className={styles.label}>Email Address</label>
                        <input
                            required
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            className={styles.input}
                        />
                    </div>

                    <div>
                        <label className={styles.label}>Password</label>
                        <input
                            required
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className={styles.input}
                        />
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <a href="#" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Forgot password?</a>
                    </div>

                    <button disabled={isLoading} type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', opacity: isLoading ? 0.7 : 1 }}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p style={{ marginBottom: '1rem' }}>
                        New Seller? <Link href="/auth/signup" className={styles.linkPrimary}>Start Selling</Link>
                    </p>
                    <p>
                        New Buyer? <Link href="/auth/signup-buyer" className={styles.linkAccent}>Create Buyer Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
