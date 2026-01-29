'use server';

import { getSession } from '@/utils/session';
import { prisma } from '@/utils/prisma';

export async function updateLocation(lat: number, lng: number) {
    const session = await getSession();
    if (!session || !session.userId) {
        return { error: 'Unauthorized' };
    }

    try {
        await prisma.profile.update({
            where: { id: session.userId },
            data: {
                currentLat: lat,
                currentLng: lng,
                lastLocationUpdate: new Date()
            }
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating location:', error);
        return { error: 'Failed to update location' };
    }
}

export async function getCourierLocation(trackingCode: string) {
    try {
        const item = await prisma.orderItem.findFirst({
            where: { trackingCode },
            include: {
                // Find the courier assigned to this item only IF they are the ones delivering it.
                // Our schema has courierId on OrderItem.
                // But wait, the schema relation for courierId wasn't explicit in Profile?
                // Looking at schema: courierId String? @map("courier_id")
                // We assume there's a way to link it to Profile or we just use that ID.
            }
        });

        if (!item || !item.courierId) {
            return { error: 'Courier not assigned or item not found' };
        }

        // Fetch the courier profile using the ID stored in courierId
        // Assuming courierId corresponds to a Profile.id (since couriers are users)
        const courier = await prisma.profile.findUnique({
            where: { id: item.courierId },
            select: {
                currentLat: true,
                currentLng: true,
                lastLocationUpdate: true,
                fullName: true
            }
        });

        if (!courier) {
            return { error: 'Courier profile not found' };
        }

        return {
            success: true,
            location: {
                lat: courier.currentLat,
                lng: courier.currentLng,
                updatedAt: courier.lastLocationUpdate,
                name: courier.fullName
            }
        };
    } catch (error) {
        console.error('Error fetching courier location:', error);
        return { error: 'Failed to fetch location' };
    }
}
