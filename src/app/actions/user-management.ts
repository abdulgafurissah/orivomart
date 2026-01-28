'use server';

import { prisma } from '@/utils/prisma';

export async function getAllUsers() {
    try {
        const users = await prisma.profile.findMany({
            orderBy: { createdAt: 'desc' }
        });
        // Convert dates to strings for client component serialization
        return users.map(user => ({
            ...user,
            created_at: user.createdAt.toISOString(),
            full_name: user.fullName || 'Unknown' // Map fullName to full_name for compatibility
        }));
    } catch (e) {
        console.error('Error fetching users:', e);
        return [];
    }
}

export async function updateUserRole(userId: string, newRole: string) {
    try {
        await prisma.profile.update({
            where: { id: userId },
            data: { role: newRole }
        });
        return { success: true };
    } catch (e: any) {
        console.error('Error updating role:', e);
        return { error: e.message };
    }
}
