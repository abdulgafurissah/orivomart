'use server';

import { prisma } from '@/utils/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function createCourier(formData: FormData) {
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validate
    if (!fullName || !email || !password) {
        return { error: 'All fields are required' };
    }

    try {
        const existing = await prisma.profile.findUnique({ where: { email } });
        if (existing) return { error: 'Email already exists' };

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.profile.create({
            data: {
                email,
                password: hashedPassword,
                fullName,
                role: 'courier' // Specific role for actual riders
            }
        });

        revalidatePath('/admin/delivery');
        revalidatePath('/delivery/dashboard');
        return { success: 'Courier created successfully' };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function deleteCourier(userId: string) {
    try {
        await prisma.profile.delete({
            where: { id: userId }
        });
        revalidatePath('/admin/delivery');
        revalidatePath('/delivery/dashboard');
        return { success: 'Courier deleted' };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function updateCourier(userId: string, formData: FormData) {
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;

    try {
        await prisma.profile.update({
            where: { id: userId },
            data: { fullName, email }
        });
        revalidatePath('/admin/delivery');
        revalidatePath('/delivery/dashboard');
        return { success: 'Courier updated' };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function assignDelivery(orderItemId: string, courierId: string | null) {
    try {
        await prisma.orderItem.update({
            where: { id: orderItemId },
            data: {
                courierId: courierId,
                deliveryStatus: courierId ? 'pending_pickup' : 'pending_pickup' // Reset status if unassigned or assigned
            }
        });
        revalidatePath('/admin/delivery');
        revalidatePath('/delivery/dashboard');
        return { success: 'Assignment updated' };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function getCourierDeliveries() {
    const session = await import('@/utils/session').then(m => m.getSession());
    if (!session || session.role !== 'courier') return [];

    try {
        const deliveries = await prisma.orderItem.findMany({
            where: {
                courierId: session.userId,
                // Optional: filter out completed ones if we want active only? 
                // Let's show all for history.
            },
            include: {
                order: {
                    include: {
                        buyer: { select: { fullName: true, email: true } }
                    }
                },
                seller: {
                    select: { shopName: true, ownerName: true, phone: true, businessAddress: true, gpsAddress: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return deliveries;
    } catch (e) {
        return [];
    }
}

export async function updateCourierDeliveryStatus(itemId: string, status: string) {
    const session = await import('@/utils/session').then(m => m.getSession());
    if (!session || session.role !== 'courier') return { error: 'Unauthorized' };

    try {
        await prisma.orderItem.update({
            where: { id: itemId, courierId: session.userId },
            data: { deliveryStatus: status }
        });

        const { revalidatePath } = await import('next/cache');
        revalidatePath('/courier/dashboard');

        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}
