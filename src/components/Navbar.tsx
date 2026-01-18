'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className="container">
                <div className={styles.navInner}>
                    <Link href="/" className={styles.logo}>
                        <span className="text-gradient">Agifarmz</span>
                    </Link>

                    <div className={styles.links}>
                        <Link href="/" className={styles.link}>Home</Link>
                        <Link href="/shop" className={styles.link}>Shop</Link>
                        <Link href="/sellers" className={styles.link}>Sellers</Link>
                        <Link href="/about" className={styles.link}>About</Link>
                    </div>

                    <div className={styles.actions}>
                        <Link href="/cart" className={styles.iconBtn} aria-label="Cart">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                        </Link>
                        <Link href="/auth/signin" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
