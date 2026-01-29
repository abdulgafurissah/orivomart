'use server';

import { getSession } from '@/utils/session';
import { prisma } from '@/utils/prisma';
import { revalidatePath } from 'next/cache';

export async function createDispute(data: { orderId: string; reason: string; description: string }) {
    const session = await getSession();
    if (!session || !session.userId) {
        return { success: false, message: 'Unauthorized' };
    }

    try {
        await prisma.dispute.create({
            data: {
                orderId: data.orderId,
                buyerId: session.userId,
                reason: data.reason,
                description: data.description,
                status: 'open'
            }
        });

        revalidatePath('/orders');
        revalidatePath('/admin/dashboard'); // Assuming admins see it there
        return { success: true, message: 'Dispute submitted successfully' };
    } catch (error) {
        console.error('Error creating dispute:', error);
        return { success: false, message: 'Failed to submit dispute' };
    }
}
