'use server';

import { prisma } from '@/utils/prisma';
import { getSession } from '@/utils/session';

export async function getSellerProfile() {
    const session = await getSession();
    if (!session || !session.email) return null;

    try {
        // Find seller by user's email
        // Note: Prisma schema links Seller to Profile via userId. 
        // We can query Seller directly if we know it links to a profile with this email.
        const seller = await prisma.seller.findFirst({
            where: {
                profile: {
                    email: session.email
                }
            }
        });

        // Serialize Decimals for client component
        if (seller) {
            return {
                ...seller,
                rating: seller.rating.toString(),
                createdAt: seller.createdAt.toISOString(),
                coverImage: seller.coverImage || null, // Ensure explicit null
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching seller:', error);
        return null;
    }
}



import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client for Storage ONLY
function getSupabaseStorage() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Fallback to Anon key if Service Role is missing (works if bucket is public)
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
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
    const shopImage = formData.get('shopImage') as File;
    const coverImage = formData.get('coverImage') as File; // New file

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

        // 3. Upload Images
        let imageUrl = seller.image;
        let coverImageUrl = seller.coverImage;
        const supabase = getSupabaseStorage();

        if (supabase) {
            // Shop Logo
            if (shopImage && shopImage.size > 0) {
                const fileExt = shopImage.name.split('.').pop();
                const fileName = `${seller.userId}/shop_${Date.now()}.${fileExt}`;
                const { error: uploadError, data: uploadData } = await supabase.storage
                    .from('shop-images')
                    .upload(fileName, shopImage, { upsert: true });

                if (!uploadError && uploadData) {
                    imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/shop-images/${fileName}`;
                }
            }

            // Shop Cover
            if (coverImage && coverImage.size > 0) {
                const fileExt = coverImage.name.split('.').pop();
                const fileName = `${seller.userId}/cover_${Date.now()}.${fileExt}`;
                const { error: uploadError, data: uploadData } = await supabase.storage
                    .from('shop-images')
                    .upload(fileName, coverImage, { upsert: true });

                if (!uploadError && uploadData) {
                    coverImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/shop-images/${fileName}`;
                }
            }
        }

        // 4. Update Profile (User Account)
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

        // 5. Update Seller Details
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
                image: imageUrl,
                coverImage: coverImageUrl
            }
        });

        revalidatePath('/dashboard');
        return { success: 'Settings updated successfully' };

    } catch (error: any) {
        console.error('Update settings error:', error);
        return { error: error.message || 'Failed to update settings' };
    }
}
