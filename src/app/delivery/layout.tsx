
import { getSession } from '@/utils/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import '../globals.css';

export default async function DeliveryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session || !['admin', 'delivery_manager'].includes(session.role)) {
        redirect('/auth/signin');
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{
                width: '250px',
                background: 'rgba(0,0,0,0.3)',
                borderRight: '1px solid var(--glass-border)',
                backdropFilter: 'blur(10px)',
                position: 'fixed',
                height: '100vh',
                padding: '2rem 1rem'
            }}>
                <div style={{ marginBottom: '3rem', paddingLeft: '1rem' }}>
                    <h2 className="text-gradient" style={{ fontSize: '1.5rem' }}>Delivery Dept.</h2>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link
                        href="/delivery/dashboard"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px 16px',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--primary)',
                            color: 'white',
                        }}
                    >
                        <span>🚚</span>
                        <span>Dashboard</span>
                    </Link>
                </nav>

                <div style={{ position: 'absolute', bottom: '2rem', left: '1rem', width: 'calc(100% - 2rem)' }}>
                    <Link href="/" className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }}>
                        Back to Mall
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{
                marginLeft: '250px',
                flex: 1,
                padding: '2rem',
                maxWidth: 'calc(100vw - 250px)'
            }}>
                {children}
            </main>
        </div>
    );
}
