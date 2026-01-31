
import DeliveryManagementClient from '@/components/delivery/DeliveryManagementClient';

export default async function AdminDeliveryPage() {
    const { prisma } = await import('@/utils/prisma');

    // Fetch all active deliveries
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
        price: Number(item.price),
        createdAt: item.createdAt.toISOString(),
        order: {
            ...item.order,
            totalAmount: Number(item.order.totalAmount),
            createdAt: item.order.createdAt.toISOString(),
            commitmentFee: Number(item.order.commitmentFee),
            remainingBalance: Number(item.order.remainingBalance)
        },
        seller: {
            shop_name: item.seller?.shopName || 'Unknown Shop',
            owner_name: item.seller?.ownerName || 'Unknown Owner'
        },
        product_name: item.productName,
        tracking_code: item.trackingCode,
        delivery_status: item.deliveryStatus
    }));

    // Fetch all courier profiles
    const couriersList = await prisma.profile.findMany({
        where: { role: 'courier' },
        orderBy: { createdAt: 'desc' }
    });

    const couriers = couriersList.map(c => ({
        ...c,
        created_at: c.createdAt.toISOString(),
        full_name: c.fullName
    }));

    return (
        <DeliveryManagementClient
            deliveries={deliveries || []}
            couriers={couriers || []}
        />
    );
}
