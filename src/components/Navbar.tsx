'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

import { useCart } from '@/context/CartContext';

import { logout } from '@/app/actions/auth-actions';

interface NavbarProps {
    user?: any;
}

export default function Navbar({ user }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false);
    const { cart } = useCart();

    // Calculate total items (sum of quantities or just distinct items)
    // Usually customers expect quantity sum or distinct items. Let's do distinct items count for simplicity or item quantity sum.
    const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
                <div className="container">
                    <div className={styles.navInner}>
                        <Link href="/" className={styles.logo} onClick={() => setMobileMenuOpen(false)}>
                            <span className="text-gradient">OrivoMart</span>
                        </Link>

                        {/* Desktop Links */}
                        <div className={styles.links}>
                            <Link href="/" className={styles.link}>Home</Link>
                            <Link href="/sellers" className={styles.link}>Shops</Link>
                            <Link href="/about" className={styles.link}>About</Link>
                            <Link href="/track" className={styles.link}>Track Order</Link>
                            {user && user.role === 'buyer' && <Link href="/orders" className={styles.link}>My Orders</Link>}
                            {user?.role === 'admin' && <Link href="/admin/dashboard" className={styles.link}>Admin</Link>}
                            {user?.role === 'seller' && <Link href="/dashboard" className={styles.link}>Dashboard</Link>}
                            {user?.role === 'delivery_manager' && <Link href="/delivery/dashboard" className={styles.link}>Dashboard</Link>}
                        </div>

                        <div className={styles.actions}>
                            <Link href="/cart" className={styles.iconBtn} aria-label="Cart" style={{ position: 'relative' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                                {cartItemCount > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '-5px',
                                        right: '-5px',
                                        background: 'var(--accent)',
                                        color: 'white',
                                        fontSize: '0.7rem',
                                        fontWeight: 'bold',
                                        borderRadius: '50%',
                                        width: '18px',
                                        height: '18px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>

                            {/* Desktop Auth Buttons */}
                            <div className={styles.links} style={{ gap: '10px' }}>
                                {!user ? (
                                    <>
                                        <Link href="/auth/signup" className="btn btn-secondary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                                            Sell
                                        </Link>
                                        <Link href="/auth/signin" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                                            Sign In
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/account" className="btn btn-secondary" style={{ marginRight: '10px', padding: '8px 20px', fontSize: '0.9rem' }}>
                                            My Account
                                        </Link>
                                        <button
                                            onClick={() => logout()}
                                            className="btn btn-primary"
                                            style={{ padding: '8px 20px', fontSize: '0.9rem', cursor: 'pointer' }}
                                        >
                                            Logout
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Mobile Toggle */}
                            <button className={styles.mobileToggle} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                {mobileMenuOpen ? '✕' : '☰'}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`${styles.mobileOverlay} ${mobileMenuOpen ? styles.open : ''}`}>
                <Link href="/" className={styles.logo} style={{ fontSize: '1.2rem' }} onClick={() => setMobileMenuOpen(false)}>
                    Home
                </Link>
                <Link href="/sellers" className={styles.logo} style={{ fontSize: '1.2rem' }} onClick={() => setMobileMenuOpen(false)}>
                    View Shops
                </Link>
                <Link href="/about" className={styles.logo} style={{ fontSize: '1.2rem' }} onClick={() => setMobileMenuOpen(false)}>
                    About
                </Link>
                <Link href="/track" className={styles.logo} style={{ fontSize: '1.2rem' }} onClick={() => setMobileMenuOpen(false)}>
                    Track Order
                </Link>
                {user && user.role === 'buyer' && (
                    <Link href="/orders" className={styles.logo} style={{ fontSize: '1.2rem' }} onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
                )}
                {user?.role === 'admin' && (
                    <Link href="/admin/dashboard" className={styles.logo} style={{ fontSize: '1.2rem' }} onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>
                )}
                {user?.role === 'seller' && (
                    <Link href="/dashboard" className={styles.logo} style={{ fontSize: '1.2rem' }} onClick={() => setMobileMenuOpen(false)}>Seller Dashboard</Link>
                )}

                <hr style={{ borderColor: 'var(--card-border)' }} />

                {!user ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Link href="/auth/signin" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
                            Sign In
                        </Link>
                        <Link href="/auth/signup" className="btn btn-secondary" onClick={() => setMobileMenuOpen(false)}>
                            Become a Seller
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Link href="/account" className="btn btn-secondary" onClick={() => setMobileMenuOpen(false)}>
                            My Account
                        </Link>
                        <button
                            onClick={() => logout()}
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
