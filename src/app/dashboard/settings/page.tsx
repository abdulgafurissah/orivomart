
import { getSellerProfile } from '@/app/actions/seller-actions';
import { getSession } from '@/utils/session';
import { redirect } from 'next/navigation';
import SettingsForm from './settings-form';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const session = await getSession();
    if (!session || session.role !== 'seller') {
        redirect('/auth/signin');
    }

    // We already fetch seller profile via action, but let's confirm email consistency
    // The action returns a formatted object.
    const seller = await getSellerProfile();

    if (!seller) {
        return (
            <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
                <h1>Seller Profile Not Found</h1>
                <p>Please contact support or try logging in again.</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                    Settings
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Manage your shop profile, account security, and contact information.
                </p>
            </div>

            <SettingsForm seller={seller} email={session.email} />
        </div>
    );
}
