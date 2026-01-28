
import { getSession } from '@/utils/session';
import { redirect } from 'next/navigation';
import ShipNowForm from './ship-now-form';

export default async function ShipNowPage() {
    const session = await getSession();

    if (!session) {
        redirect('/auth/signin?redirect=/ship-now');
    }

    const userData = {
        name: session.user_metadata?.full_name || session.email, // Adjust based on how you store name in session or fetch profile
        email: session.email,
        // In a real app, fetch address from profile db
        phone: '',
        address: ''
    };

    // Since session only has basic info, we might want to fetch full profile here if needed.
    // For now let's pass what we have.

    return <ShipNowForm user={session} />;
}
