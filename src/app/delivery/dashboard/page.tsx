

import DeliveryManagementClient from '@/components/delivery/DeliveryManagementClient';
import { getSession } from '@/utils/session';
import { redirect } from 'next/navigation';

export default async function DeliveryManagerDashboard() {
    const session = await getSession();
    if (!session || session.role !== 'delivery_manager') {
        redirect('/auth/signin');
    }

    const { prisma } = await import('@/utils/prisma');

    // Fetch all deliveries
    const deliveryItems = await prisma.orderItem.findMany({
        include: {
            order: true,
            seller: {
                select: { shopName: true, ownerName: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    const deliveries = deliveryItems.map(item => ({
        ...item,
        order: item.order,
        seller: {
            shop_name: item.seller?.shopName,
            owner_name: item.seller?.ownerName
        },
        // Map required fields to snake_case if Client component expects it?
        // Let's assume for now we might need to cast or map key props if the Client is strictly typed to Supabase types.
        // Checking usage: <DeliveryManagementClient deliveries={deliveries} ... />
        product_name: item.productName,
        tracking_code: item.trackingCode,
        delivery_status: item.deliveryStatus
    }));

    // Fetch couriers
    const couriersList = await prisma.profile.findMany({
        where: { role: 'courier' },
        orderBy: { createdAt: 'desc' }
    });

    // Map couriers to match Supabase shape if needed (created_at vs createdAt)
    const couriers = couriersList.map(c => ({
        ...c,
        created_at: c.createdAt.toISOString(),
        full_name: c.fullName
    }));

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            {/* Header specific to Manager */}
            <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Welcome back, Manager</h2>
            </div>

            <DeliveryManagementClient
                deliveries={deliveries || []}
                couriers={couriers || []}
            />
        </div>
    );
}
