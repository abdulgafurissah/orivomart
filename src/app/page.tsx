import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className="container">
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Modern Solutions for <br />
            <span className="text-gradient">Smart Farming</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Access premium agricultural supplies from vetted sellers.
            From high-yield seeds to advanced machinery, we bridge the gap between farmers and verified suppliers.
          </p>
          <div className={styles.heroActions}>
            <Link href="/shop" className="btn btn-primary">
              Explore Marketplace
            </Link>
            <Link href="/auth/signup" className="btn btn-secondary">
              Sell on Agifarmz
            </Link>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.orb}></div>
          {/* We can place a generated image here later */}
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Why Choose Agifarmz?</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <span className={styles.cardIcon}>🛡️</span>
            <h3 className={styles.cardTitle}>Vetted Sellers</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Every shop owner is verified by our admin team to ensure quality and trust.
            </p>
          </div>
          <div className={styles.card}>
            <span className={styles.cardIcon}>💳</span>
            <h3 className={styles.cardTitle}>Secure Payments</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Integrated with Paystack for seamless and secure transactions directly to sellers.
            </p>
          </div>
          <div className={styles.card}>
            <span className={styles.cardIcon}>🚀</span>
            <h3 className={styles.cardTitle}>Fast Logistics</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Get your farm supplies delivered right to your doorstep or farm gate.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Browse Categories</h2>
        <div className={styles.grid}>
          {[
            { name: 'Seeds & Seedlings', icon: '🌱', link: '/shop?cat=seeds' },
            { name: 'Fertilizers', icon: '🧪', link: '/shop?cat=fertilizers' },
            { name: 'Pesticides', icon: '☠️', link: '/shop?cat=pesticides' },
            { name: 'Farm Equipment', icon: '🚜', link: '/shop?cat=equipment' },
            { name: 'Animal Feed', icon: '🌽', link: '/shop?cat=feed' },
            { name: 'Vet Medicine', icon: '💉', link: '/shop?cat=medicine' },
          ].map((cat) => (
            <Link href={cat.link} key={cat.name} className={styles.card}>
              <span className={styles.cardIcon}>{cat.icon}</span>
              <h3 className={styles.cardTitle}>{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.section} style={{ textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready to Grow?</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Join thousands of farmers optimizing their yield with Agifarmz.</p>
          <Link href="/auth/signup" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
