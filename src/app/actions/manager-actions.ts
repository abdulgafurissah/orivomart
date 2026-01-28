'use server';

import { prisma } from '@/utils/prisma';
import { revalidatePath } from 'next/cache';

export async function approveShipment(orderItemId: string, finalPrice: number) {
    try {
        const item = await prisma.orderItem.findUnique({
            where: { id: orderItemId },
            include: { order: true }
        });

        if (!item || !item.order) return { error: 'Shipment not found' };

        // Parse details to find payer
        const details = typeof item.order.shippingDetails === 'string'
            ? JSON.parse(item.order.shippingDetails)
            : item.order.shippingDetails as any;

        const payer = details?.payer || 'sender';

        // Update Price
        await prisma.order.update({
            where: { id: item.orderId },
            data: {
                totalAmount: finalPrice,
                status: payer === 'sender' ? 'waiting_payment' : 'ready_for_dispatch'
            }
        });

        // Update Item Status
        // If Payer is SENDER: status -> 'pending_payment'
        // If Payer is RECEIVER: status -> 'pending_pickup' (Ready for rider)
        const newStatus = payer === 'sender' ? 'pending_payment' : 'pending_pickup';

        await prisma.orderItem.update({
            where: { id: orderItemId },
            data: {
                deliveryStatus: newStatus,
                price: finalPrice
            }
        });

        revalidatePath('/admin/delivery');
        return { success: 'Shipment Approved' };

    } catch (e: any) {
        return { error: e.message };
    }
}

export async function markAsPaid(orderItemId: string) {
    try {
        await prisma.orderItem.update({
            where: { id: orderItemId },
            data: { deliveryStatus: 'pending_pickup' } // Now ready for rider
        });

        // Also update order status
        const item = await prisma.orderItem.findUnique({ where: { id: orderItemId } });
        if (item) {
            await prisma.order.update({
                where: { id: item.orderId },
                data: { status: 'paid' }
            });
        }

        revalidatePath('/admin/delivery');
        return { success: 'Marked as Paid' };
    } catch (e: any) {
        return { error: e.message };
    }
}
