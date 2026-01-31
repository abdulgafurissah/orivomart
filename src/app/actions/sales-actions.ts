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
    // robustness: also check for Items where sellerId might be missing but productId belongs to seller
    const sellerProducts = await prisma.product.findMany({
        where: { sellerId: seller.id },
        select: { id: true }
    });
    const productIds = sellerProducts.map(p => p.id);

    const sales = await prisma.orderItem.findMany({
        where: {
            OR: [
                { sellerId: seller.id },
                {
                    sellerId: null,
                    productId: { in: productIds }
                }
            ]
        },
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

        const { revalidatePath } = await import('next/cache');
        revalidatePath('/dashboard/sales');

        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function deleteOrderItem(itemId: string) {
    const session = await getSession();
    if (!session || session.role !== 'seller') return { error: 'Unauthorized' };

    try {
        // Validation: Ensure item belongs to seller
        const seller = await prisma.seller.findUnique({ where: { userId: session.userId } });
        const item = await prisma.orderItem.findUnique({ where: { id: itemId } });

        if (!item || !seller || (item.sellerId && item.sellerId !== seller.id)) {
            // Fallback check via product ownership if sellerId is missing
            if (item && item.productId) {
                const product = await prisma.product.findUnique({ where: { id: item.productId } });
                if (!product || product.sellerId !== seller?.id) {
                    return { error: 'Unauthorized: Item not found or not yours' };
                }
            } else {
                return { error: 'Unauthorized' };
            }
        }

        await prisma.orderItem.delete({
            where: { id: itemId }
        });

        const { revalidatePath } = await import('next/cache');
        revalidatePath('/dashboard/sales');

        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
