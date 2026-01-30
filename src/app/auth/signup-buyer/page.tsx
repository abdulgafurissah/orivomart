'use client';

import { useState } from 'react';
import Link from 'next/link';

import { useRouter } from 'next/navigation';

import styles from '../auth.module.css';

export default function BuyerSignup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();


    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('name', fullName);
        formData.append('role', 'buyer');

        try {
            const { signup } = await import('@/app/actions/auth-actions');
            const result = await signup(formData);

            if (result?.error) {
                alert(result.error);
            }
            // If success, the action redirects, so we don't need to do anything here usually.
            // But if we wanted to show a success message first, we'd need the action to return success status instead of redirecting immediately.
            // checking auth-actions.ts, it redirects on success.

        } catch (err) {
            console.error(err);
            alert('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`container ${styles.container}`}>
            <div className={`glass-panel ${styles.authPanel}`}>
                <h2 className={styles.title}>Create Buyer Account</h2>
                <p className={styles.subtitle}>
                    Join OrivoMart to buy fresh produce directly.
                </p>

                <form onSubmit={handleSignup} className={styles.form}>
                    <div>
                        <label className={styles.label}>Full Name</label>
                        <input
                            required
                            type="text"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className={styles.input}
                        />
                    </div>

                    <div>
                        <label className={styles.label}>Email Address</label>
                        <input
                            required
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                        />
                    </div>

                    <div>
                        <label className={styles.label}>Password</label>
                        <input
                            required
                            type="password"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                        />
                    </div>

                    <button disabled={isLoading} type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', opacity: isLoading ? 0.7 : 1 }}>
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>
                        Already have an account? <Link href="/auth/signin" className={styles.linkPrimary}>Sign In</Link>
                    </p>
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--card-border)' }}>
                        <Link href="/auth/signup" className={styles.linkAccent}>Want to Sell on OrivoMart?</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
