'use server';

import { prisma } from '@/utils/prisma';
import { revalidatePath } from 'next/cache';

// Pricing Configuration
const basePrice = 20; // Base fee in GHS
const weightMultipliers: Record<string, number> = {
    'small': 1,   // < 2kg
    'medium': 1.5, // 2-10kg
    'large': 2.5,  // > 10kg
};
const serviceMultipliers: Record<string, number> = {
    'standard': 1,
    'express': 1.5,
    'overnight': 2.5
};

export async function calculateShippingQuote(weightCategory: string, serviceType: string) {
    // Simple dynamic pricing logic
    const weightMult = weightMultipliers[weightCategory] || 1;
    const serviceMult = serviceMultipliers[serviceType] || 1;

    // In a real app, distance would be a factor.
    const estimatedPrice = basePrice * weightMult * serviceMult;

    return {
        price: estimatedPrice,
        currency: 'GHS'
    };
}

export async function createIndependentDelivery(formData: FormData) {
    const senderName = formData.get('senderName') as string;
    const senderPhone = formData.get('senderPhone') as string;
    const pickupAddress = formData.get('pickupAddress') as string;

    const receiverName = formData.get('receiverName') as string;
    const receiverPhone = formData.get('receiverPhone') as string;
    const receiverAddress = formData.get('receiverAddress') as string;

    const itemDescription = formData.get('itemDescription') as string;

    // New Fields
    const weightCategory = formData.get('weightCategory') as string; // small, medium, large
    const serviceType = formData.get('serviceType') as string; // standard, express, overnight

    if (!senderName || !pickupAddress || !receiverName || !receiverAddress || !itemDescription) {
        return { error: 'Please fill in all required fields.' };
    }

    try {
        // Calculate Price
        const quote = await calculateShippingQuote(weightCategory, serviceType);

        const shippingDetails = {
            sender: {
                name: senderName,
                phone: senderPhone,
                address: pickupAddress
            },
            receiver: {
                name: receiverName,
                phone: receiverPhone,
                address: receiverAddress
            },
            package: {
                weightCategory,
                serviceType,
                description: itemDescription
            }
        };

        const order = await prisma.order.create({
            data: {
                totalAmount: quote.price,
                currency: 'GHS',
                status: 'pending', // Payment would happen here normally
                shippingDetails: shippingDetails as any
            }
        });

        const trackingCode = 'TRK-' + Math.floor(100000 + Math.random() * 900000);

        await prisma.orderItem.create({
            data: {
                orderId: order.id,
                productId: 'INDEPENDENT_PARCEL',
                productName: `${itemDescription} (${serviceType.toUpperCase()})`,
                quantity: 1,
                price: quote.price,
                trackingCode: trackingCode,
                deliveryStatus: 'pending_pickup',
            }
        });

        revalidatePath('/admin/delivery');
        return {
            success: `Order Placed! Cost: GHS ${quote.price}. Tracking Code: ${trackingCode}`,
            trackingCode,
            price: quote.price
        };
    } catch (e: any) {
        console.error(e);
        return { error: 'Failed to submit request: ' + e.message };
    }
}
