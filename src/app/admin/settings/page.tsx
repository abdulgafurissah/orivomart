
import { getSession } from '@/utils/session';
import { prisma } from '@/utils/prisma';
import { redirect } from 'next/navigation';
import SettingsForm from './settings-form';

export default async function AdminSettingsPage() {
    const session = await getSession();

    if (!session || session.role !== 'admin') {
        redirect('/auth/signin');
    }

    const user = await prisma.profile.findUnique({
        where: { id: session.userId },
        select: {
            email: true,
            fullName: true,
        }
    });

    if (!user) {
        // Should not happen if session is valid
        return <div>User not found.</div>;
    }

    return <SettingsForm user={user} />;
}
