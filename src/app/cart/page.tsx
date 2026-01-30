
import CartClient from './cart-client';
import { getSession } from '@/utils/session';
import { prisma } from '@/utils/prisma';

export default async function CartPage() {
    const session = await getSession();
    let userProfile = null;

    if (session?.userId) {
        userProfile = await prisma.profile.findUnique({
            where: { id: session.userId }
        });
    }

    return <CartClient user={session} userProfile={userProfile} />;
}
