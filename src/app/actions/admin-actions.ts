'use server';

import { prisma } from '@/utils/prisma';
import { getSession } from '@/utils/session';

export async function getAdminStats() {
    const session = await getSession();
    if (!session || session.role !== 'admin') return { error: 'Unauthorized' };

    try {
        const totalUsers = await prisma.profile.count();
        const totalSellers = await prisma.seller.count();
        const pendingSellers = await prisma.seller.count({ where: { status: 'pending' } });
        // const totalProducts = await prisma.product.count();

        return {
            totalUsers,
            totalSellers,
            pendingSellers,
            totalProducts: 0 // Placeholder until Product model is fully integrated or if wanted
        };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function getSellersList() {
    const session = await getSession();
    if (!session || session.role !== 'admin') return { error: 'Unauthorized' };

    try {
        const sellers = await prisma.seller.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return { data: sellers };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function updateSellerStatus(sellerId: string, status: string) {
    const session = await getSession();
    if (!session || session.role !== 'admin') return { error: 'Unauthorized' };

    try {
        // Also update verified flag
        const verified = status === 'active';
        await prisma.seller.update({
            where: { id: sellerId },
            data: {
                status,
                verified
            }
        });
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function deleteSeller(sellerId: string) {
    const session = await getSession();
    if (!session || session.role !== 'admin') return { error: 'Unauthorized' };

    try {
        const seller = await prisma.seller.findUnique({
            where: { id: sellerId },
            select: { userId: true }
        });

        if (seller && seller.userId) {
            await prisma.profile.delete({
                where: { id: seller.userId }
            });
        } else {
            // Fallback if no user linked (edge case) or just clean up seller
            await prisma.seller.delete({
                where: { id: sellerId }
            });
        }
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function getAllOrders() {
    const session = await getSession();
    if (!session || session.role !== 'admin') return { error: 'Unauthorized' };

    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                items: true
            }
        });
        return { data: orders };
    } catch (e: any) {
        return { error: e.message };
    }
}
