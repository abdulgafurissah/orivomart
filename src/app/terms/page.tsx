
import Link from 'next/link';

export const metadata = {
    title: 'User Policy Agreement | OrivoMart',
    description: 'Terms and Conditions for using OrivoMart services.',
};

export default function UserAgreementPage() {
    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
            <div className="glass-panel" style={{ padding: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>User Policy Agreement</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>Last Updated: {new Date().toLocaleDateString()}</p>

                <div className="policy-content" style={{ lineHeight: '1.8' }}>

                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary)' }}>1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using OrivoMart (the "Platform"), you agree to be bound by this User Policy Agreement (the "Agreement").
                            If you do not agree, you must immediately cease using the Platform. OrivoMart reserves the right to modify these terms at any time without prior notice.
                            Continued use constitutes acceptance of updated terms.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary)' }}>2. Platform Rights & Ownership</h2>
                        <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li>
                                <strong>Absolute Discretion:</strong> OrivoMart retains the absolute right to suspend, terminate, or restrict access to any user account (Buyer, Seller, or Courier) at its sole discretion, for any reason or no reason, without liability or notice.
                            </li>
                            <li>
                                <strong>Intellectual Property:</strong> All content, designs, code, and data on the Platform are the exclusive property of OrivoMart. Users grant OrivoMart a perpetual, irrevocable, royalty-free license to use any content uploaded to the platform.
                            </li>
                            <li>
                                <strong>Data Usage:</strong> OrivoMart reserves the right to aggregate, analyze, and monetize user data and transaction history to improve services and for commercial purposes, subject to our Privacy Policy.
                            </li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary)' }}>3. Seller Obligations</h2>
                        <p>Sellers on OrivoMart utilize the platform as a privilege, not a right.</p>
                        <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li>Sellers warrant that all products listed are authentic and legal. Counterfeit goods will result in immediate account termination and forfeiture of funds.</li>
                            <li>OrivoMart reserves the right to hold seller funds for up to 180 days in cases of suspected fraud, disputes, or policy violations.</li>
                            <li>Sellers indemnify OrivoMart against all claims, damages, and legal fees arising from their products or conduct.</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary)' }}>4. Buyer Responsibilities</h2>
                        <p>
                            Buyers agree to conduct transactions in good faith. Abuse of the dispute system, chargebacks, or harassment of sellers/support staff will result in a permanent ban.
                            OrivoMart is a facilitator and is not a party to the contract between Buyer and Seller, though we facilitate dispute resolution at our discretion.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary)' }}>5. Limitation of Liability</h2>
                        <p style={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, ORIVOMART SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
                        </p>
                        <p style={{ marginTop: '1rem' }}>
                            In no event shall OrivoMart's aggregate liability exceed the greater of one hundred US dollars ($100) or the amount you paid OrivoMart in the past six months.
                        </p>
                    </section>

                    <section style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary)' }}>6. Dispute Resolution</h2>
                        <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <li>All disputes must first be attempted to be resolved through the OrivoMart Dispute Center.</li>
                            <li><strong>Final Decision:</strong> OrivoMart's decision on any dispute is final and binding on both Buyer and Seller.</li>
                            <li><strong>Waiver of Class Action:</strong> You agree to resolve any claims on an individual basis and waive the right to participate in a class action lawsuit.</li>
                        </ul>
                    </section>
                </div>

                <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
                    <p style={{ marginBottom: '1.5rem' }}>By using OrivoMart, you acknowledge that you have read and agree to these terms.</p>
                    <Link href="/auth/signup" className="btn btn-primary" style={{ padding: '12px 30px' }}>
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
}
