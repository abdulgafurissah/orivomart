'use client';

import Link from 'next/link';

export default function AboutPage() {
    return (
        <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '50vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'white'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>About OrivoMart</h1>
                    <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', opacity: 0.9 }}>
                        Reimagining the online shopping experience. One platform, infinite possibilities.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="container" style={{ marginTop: '-4rem', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2.5rem' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚀</div>
                        <h2 style={{ marginBottom: '1rem' }}>Our Mission</h2>
                        <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            To create a seamless, trusted, and limitless marketplace where anyone can find anything they need, and where businesses of all sizes can thrive by reaching customers directly.
                        </p>
                    </div>
                    <div className="glass-panel" style={{ padding: '2.5rem' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌍</div>
                        <h2 style={{ marginBottom: '1rem' }}>Our Vision</h2>
                        <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            To be the premier digital mall that bridges the gap between premium global brands and local shoppers, fostering an ecosystem of quality, trust, and convenience.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="container" style={{ marginTop: '5rem' }}>
                <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '3rem' }}>Why Choose OrivoMart?</h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '80px', background: 'rgba(46, 204, 113, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem' }}>
                            🛡️
                        </div>
                        <h3 style={{ marginBottom: '1rem' }}>Trusted Sellers</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Every shop on our platform is verified to ensure you get authentic products every time.</p>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '80px', background: 'rgba(52, 152, 219, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem' }}>
                            💳
                        </div>
                        <h3 style={{ marginBottom: '1rem' }}>Secure Payments</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>We use state-of-the-art encryption via Paystack to ensure your financial data is always safe.</p>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '80px', background: 'rgba(155, 89, 182, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem' }}>
                            ⚡
                        </div>
                        <h3 style={{ marginBottom: '1rem' }}>Fast Delivery</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Get your items delivered to your doorstep quickly and reliably through our logistics partners.</p>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '80px', background: 'rgba(230, 126, 34, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem' }}>
                            🛍️
                        </div>
                        <h3 style={{ marginBottom: '1rem' }}>Vast Selection</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>From electronics to fashion, groceries to beauty - if you need it, we have it.</p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="container" style={{ marginTop: '5rem' }}>
                <div className="glass-panel" style={{
                    padding: '4rem',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.1), rgba(52, 152, 219, 0.1))',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Ready to Experience the Best?</h2>
                    <p style={{ maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                        Join thousands of happy shoppers and discover products you'll love today.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link href="/shop" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '1.1rem' }}>
                            Start Shopping
                        </Link>
                        <Link href="/sellers" className="btn btn-secondary" style={{ padding: '12px 32px', fontSize: '1.1rem' }}>
                            View Shops
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
