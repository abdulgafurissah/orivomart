'use server';

import { prisma } from '@/utils/prisma';
import { getSession } from '@/utils/session';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function updateAdminProfile(formData: FormData) {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return { error: 'Unauthorized' };
    }

    const email = formData.get('email') as string;
    const fullName = formData.get('fullName') as string;

    if (!email || !fullName) {
        return { error: 'Both Email and Full Name are required.' };
    }

    try {
        // Check if email is taken by another user (if email attempts to change)
        if (email !== session.email) {
            const existing = await prisma.profile.findUnique({ where: { email } });
            if (existing) {
                return { error: 'Email is already in use by another account.' };
            }
        }

        await prisma.profile.update({
            where: { id: session.userId },
            data: {
                email,
                fullName
            }
        });

        // If email changed, we might need to update session, but for now let's keep it simple.
        // ideally we should effectively re-login or update cookie, but let's assume they might need to re-login if sensitive info changes.
        // But for better UX, we just update DB.

        revalidatePath('/admin/settings');
        return { success: 'Profile updated successfully.' };

    } catch (error: any) {
        console.error('Update profile error:', error);
        return { error: `Failed to update profile: ${error.message}` };
    }
}

export async function changeAdminPassword(formData: FormData) {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return { error: 'Unauthorized' };
    }

    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return { error: 'All fields are required.' };
    }

    if (newPassword !== confirmPassword) {
        return { error: 'New passwords do not match.' };
    }

    if (newPassword.length < 6) {
        return { error: 'New password must be at least 6 characters long.' };
    }

    try {
        const user = await prisma.profile.findUnique({ where: { id: session.userId } });

        if (!user || !user.password) {
            return { error: 'User not found.' };
        }

        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return { error: 'Incorrect current password.' };
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await prisma.profile.update({
            where: { id: session.userId },
            data: { password: hashedNewPassword }
        });

        revalidatePath('/admin/settings');
        return { success: 'Password changed successfully.' };

    } catch (error: any) {
        console.error('Change password error:', error);
        return { error: `Failed to change password: ${error.message}` };
    }
}
