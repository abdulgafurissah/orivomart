
import { getSession } from '@/utils/session';
import { prisma } from '@/utils/prisma';
import { redirect } from 'next/navigation';
import AccountClient from './account-client';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
    const session = await getSession();
    if (!session) redirect('/auth/signin');

    const user = await prisma.profile.findUnique({
        where: { id: session.userId }
    });

    if (!user) redirect('/auth/signin');

    return <AccountClient user={user} />;
}
