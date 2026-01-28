'use server';

import { prisma } from '@/utils/prisma';

export async function getUserRole(email: string) {
    if (!email) return null;

    try {
        const profile = await prisma.profile.findUnique({
            where: { email },
            select: { role: true }
        });
        return profile?.role || null;
    } catch (error) {
        console.error('Error fetching user role:', error);
        return null;
    }
}
