'use server';

import { prisma } from '@/utils/prisma';
import { getSession } from '@/utils/session';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function getSellerProfile() {
    const session = await getSession();
    if (!session || !session.email) return null;

    try {
        const seller = await prisma.seller.findFirst({
            where: {
                profile: {
                    email: session.email
                }
            }
        });

        if (seller) {
            return {
                ...seller,
                rating: seller.rating.toString(),
                createdAt: seller.createdAt.toISOString(),
                coverImage: seller.coverImage || null,
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching seller:', error);
        return null;
    }
}


export async function updateSellerSettings(formData: FormData) {
    const session = await getSession();
    if (!session || !session.email) return { error: 'Unauthorized' };

    const shopName = formData.get('shopName') as string;
    const ownerName = formData.get('ownerName') as string;
    const phone = formData.get('phone') as string;
    const description = formData.get('description') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    // Images ignored for now as we removed Supabase
    // const shopImage = formData.get('shopImage') as File;
    // const coverImage = formData.get('coverImage') as File; 

    // Account Info
    const email = formData.get('email') as string;
    const newPassword = formData.get('newPassword') as string;
    const currentPassword = formData.get('currentPassword') as string;

    try {
        // 1. Get current data
        const seller = await prisma.seller.findFirst({
            where: { profile: { email: session.email } },
            include: { profile: true }
        });

        if (!seller) return { error: 'Seller not found' };

        // 2. Validate Password if changing sensitive info (email or password)
        if (newPassword || (email && email !== seller.email)) {
            if (!currentPassword) return { error: 'Current password is required to change email or password' };
            const isValid = await bcrypt.compare(currentPassword, seller.profile.password);
            if (!isValid) return { error: 'Incorrect current password' };
        }

        // 3. Update Profile (User Account)
        let profileUpdates: any = {};
        if (ownerName) profileUpdates.fullName = ownerName;
        if (email && email !== seller.email) {
            const existing = await prisma.profile.findUnique({ where: { email } });
            if (existing) return { error: 'Email already in use' };
            profileUpdates.email = email;
        }
        if (newPassword) {
            profileUpdates.password = await bcrypt.hash(newPassword, 10);
        }

        if (Object.keys(profileUpdates).length > 0) {
            await prisma.profile.update({
                where: { id: seller.userId },
                data: profileUpdates
            });
        }

        // 4. Update Seller Details
        await prisma.seller.update({
            where: { id: seller.id },
            data: {
                shopName,
                ownerName,
                phone,
                description,
                address,
                city,
                email: email || seller.email,
                // image: imageUrl, // Skipped
                // coverImage: coverImageUrl // Skipped
            }
        });

        revalidatePath('/dashboard');
        return { success: 'Settings updated successfully' };

    } catch (error: any) {
        console.error('Update settings error:', error);
        return { error: error.message || 'Failed to update settings' };
    }
}
