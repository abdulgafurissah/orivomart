'use server';

import { prisma } from '@/utils/prisma';
import { getSession } from '@/utils/session';

export async function getSellerSales() {
    const session = await getSession();
    if (!session || session.role !== 'seller') return [];

    const seller = await prisma.seller.findUnique({
        where: { userId: session.userId }
    });

    if (!seller) return [];

    // Fetch items sold by this seller
    const sales = await prisma.orderItem.findMany({
        where: { sellerId: seller.id },
        include: {
            order: {
                select: {
                    createdAt: true,
                    buyer: {
                        select: {
                            fullName: true,
                            email: true
                        }
                    },
                    shippingDetails: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return sales;
}

export async function updateOrderItemStatus(itemId: string, newStatus: string) {
    const session = await getSession();
    if (!session || session.role !== 'seller') return { error: 'Unauthorized' };

    try {
        await prisma.orderItem.update({
            where: { id: itemId },
            data: { deliveryStatus: newStatus }
        });

        // Revalidate the sales page
        const { revalidatePath } = await import('next/cache');
        revalidatePath('/dashboard/sales');

        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
