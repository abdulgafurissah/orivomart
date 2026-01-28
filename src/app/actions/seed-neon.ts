'use server';

import { prisma } from '@/utils/prisma';

export async function createAdminUser() {
    try {
        const email = 'admin@orivomart.com';

        // Check if exists
        const existing = await prisma.profile.findUnique({ where: { email } });
        if (existing) return { message: 'Admin already exists' };

        // Create Profile
        await prisma.profile.create({
            data: {
                id: 'admin-uuid-123', // Static ID for simplicity or let UUID gen
                email,
                role: 'admin',
                fullName: 'System Admin',
                password: 'temp_password_change_me'
            }
        });

        return { success: true, message: 'Admin Profile created in Neon.' };
    } catch (e: any) {
        return { error: e.message };
    }
}
