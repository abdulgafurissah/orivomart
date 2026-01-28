'use server';

import { prisma } from '@/utils/prisma';
import { getSession } from '@/utils/session';
import { revalidatePath } from 'next/cache';
import { sendSellerOrderNotification, sendBuyerOrderConfirmation } from '@/utils/email';

type OrderInput = {
    cart: any[];
    shippingInfo: {
        email: string;
        name: string;
        phone: string;
        address: string;
        gpsAddress: string;
    };
    paymentReference: string;
    total: number;
};

export async function createOrder(data: OrderInput) {
    // 1. Validate Session (Optional: guest checkout allowed?)
    // Assuming mostly logged in, but let's handle guest by checking session
    const session = await getSession();
    const buyerId = session ? session.userId : null;

    const { cart, shippingInfo, paymentReference, total } = data;

    if (!cart || cart.length === 0) return { error: 'Empty cart' };

    try {
        // 2. Create the Order
        // Note: For multi-vendor, we might want to split orders or keep them under one Order but many Items.
        // The Prisma schema allows one Order to have many Items from different Sellers.

        const order = await prisma.order.create({
            data: {
                buyerId,
                totalAmount: total,
                currency: 'GHS',
                status: 'paid', // Assuming Paystack success before calling this
                paymentReference,
                shippingDetails: shippingInfo,
            }
        });

        // 3. Create Order Items & Group by Seller for Notifications
        const sellerItemsMap = new Map<string, any[]>(); // sellerId -> items[]

        for (const item of cart) {
            // Find product to check seller
            // In a real app we might verify price again here.

            // Create Order Item
            await prisma.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: item.id,
                    productName: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    sellerId: item.sellerId,
                    // Note: 'item.sellerId' assumed to be in cart item from mock/db product
                    deliveryStatus: 'pending_pickup',
                    trackingCode: `TRK-${Math.floor(100000 + Math.random() * 900000)}`
                }
            });

            // Group for email
            if (item.sellerId) {
                const current = sellerItemsMap.get(item.sellerId) || [];
                current.push(item);
                sellerItemsMap.set(item.sellerId, current);
            }
        }

        // 4. Send Notifications to Sellers
        // We need to fetch seller email for each sellerId
        for (const [sellerId, items] of sellerItemsMap.entries()) {
            const seller = await prisma.seller.findUnique({
                where: { id: sellerId }
            });

            if (seller && seller.email) {
                // Send Email (Fire and forget to not block response)
                sendSellerOrderNotification(seller.email, seller.ownerName, order.id, items)
                    .catch(err => console.error(`Failed to email seller ${sellerId}`, err));
            }
        }

        // 5. Send Notification to Buyer
        if (shippingInfo.email) {
            sendBuyerOrderConfirmation(
                shippingInfo.email,
                shippingInfo.name,
                order.id,
                cart,
                total
            ).catch(err => console.error(`Failed to email buyer ${order.buyerId}`, err));
        }

        revalidatePath('/orders');
        return { success: true, orderId: order.id };

    } catch (e: any) {
        console.error('Create Order Error:', e);
        return { error: e.message || 'Failed to create order' };
    }
}
