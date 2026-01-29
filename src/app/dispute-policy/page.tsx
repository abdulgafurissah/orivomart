
import Link from 'next/link';

export const metadata = {
    title: 'Dispute Resolution Policy | OrivoMart',
    description: 'Guidelines for resolving disputes on OrivoMart.',
};

export default function DisputePolicyPage() {
    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
            <div className="glass-panel" style={{ padding: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Dispute Resolution Policy</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                    Ensuring fair commerce while protecting the integrity of OrivoMart.
                </p>

                <div className="policy-content" style={{ lineHeight: '1.8' }}>

                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary)' }}>1. OrivoMart as Arbitrator</h2>
                        <p>
                            OrivoMart operates as a neutral venue but reserves the right to intervene in disputes between Buyers and Sellers.
                            <strong> Decisiveness:</strong> In the event of a dispute, OrivoMart may, at its sole discretion, mediate and issue a binding decision.
                            Users agree that OrivoMart's decision is final and not subject to appeal within the platform or externally.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary)' }}>2. Filing a Dispute</h2>
                        <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li>Buyers must file a dispute within **3 days** of delivery. Failure to do so constitutes acceptance of the item "as is," waiving all future claims.</li>
                            <li>Disputes must be filed through the official Order History page. Claims made via email or social media are not valid.</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary)' }}>3. Refunds & Returns</h2>
                        <p>
                            Refunds are not guaranteed. They are issued only if:
                        </p>
                        <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li>The item is proven to be counterfeit.</li>
                            <li>The item is significantly different from the description (subject to OrivoMart's review).</li>
                            <li>The item was never delivered (verified by courier tracking).</li>
                        </ul>
                        <p style={{ marginTop: '1rem' }}>
                            <strong>Seller Liability:</strong> If a refund is approved, the Seller is liable for the full amount plus a **15% administrative fee** payable to OrivoMart.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary)' }}>4. Frivolous Claims</h2>
                        <p>
                            Any user found to be filing false or frivolous disputes (e.g., claiming non-delivery when tracking shows delivered) will be subject to an immediate **permanent ban** and may forfeit any funds remaining in their wallet/account.
                        </p>
                    </section>

                </div>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <Link href="/terms" className="btn btn-secondary">
                        Back to User Agreement
                    </Link>
                </div>
            </div>
        </div>
    );
}
