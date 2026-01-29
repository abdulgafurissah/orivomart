
import Link from 'next/link';

export default function Footer() {
    return (
        <footer style={{
            background: 'var(--card-bg)', // Using theme variable
            borderTop: '1px solid var(--border-color)',
            padding: '4rem 2rem 2rem',
            marginTop: 'auto',
            color: 'var(--text-secondary)'
        }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                        OrivoMart
                    </h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                        The premier marketplace for top brands. Trusted, Secure, and Fast.
                    </p>
                </div>

                <div>
                    <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>Shop</h4>
                    <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li><Link href="/" className="hover-underline">Marketplace</Link></li>
                        <li><Link href="/sellers" className="hover-underline">Verified Sellers</Link></li>
                        <li><Link href="/track" className="hover-underline">Track Order</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>Legal</h4>
                    <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li><Link href="/terms" className="hover-underline">User Agreement</Link></li>
                        <li><Link href="/privacy" className="hover-underline">Privacy Policy</Link></li>
                        <li><Link href="/dispute-policy" className="hover-underline">Dispute Resolution</Link></li>
                    </ul>
                </div>
            </div>

            <div style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: '2rem',
                textAlign: 'center',
                fontSize: '0.85rem'
            }}>
                &copy; {new Date().getFullYear()} OrivoMart Inc. All rights reserved.
            </div>
        </footer>
    );
}
