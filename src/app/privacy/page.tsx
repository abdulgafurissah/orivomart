
export const metadata = {
    title: 'Privacy Policy | OrivoMart',
    description: 'How we collect and manage your data.',
};

export default function PrivacyPolicyPage() {
    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
            <div className="glass-panel" style={{ padding: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Privacy Policy</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                    We value your privacy while ensuring the safety of our marketplace.
                </p>

                <div className="policy-content" style={{ lineHeight: '1.8' }}>
                    <p style={{ marginBottom: '2rem' }}>
                        This Privacy Policy outlines how OrivoMart ("we", "our") collects, uses, and safeguards your personal information.
                    </p>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '2rem' }}>1. Data Collection</h3>
                    <p>
                        We collect information you provide directly (such as account details, transaction data) and information collected automatically (device data, usage patterns).
                    </p>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '2rem' }}>2. Data Usage</h3>
                    <p>
                        We use your data to:
                    </p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', margin: '1rem 0' }}>
                        <li>Process transactions and prevent fraud.</li>
                        <li>Improve platform performance and user experience.</li>
                        <li>Develop new features and services.</li>
                        <li>Send service updates and promotional materials (you may opt out of marketing emails).</li>
                    </ul>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem', marginTop: '2rem' }}>3. Data Sharing</h3>
                    <p>
                        We do not sell your personal data to third parties. We may share data with:
                    </p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', margin: '1rem 0' }}>
                        <li>Service providers (payment processors, logistics partners).</li>
                        <li>Legal authorities when required by law or to protect OrivoMart's rights.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
