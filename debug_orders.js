
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkLatestOrders() {
    try {
        const orders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { items: true }
        });

        console.log("Latest 5 Orders:");
        orders.forEach(order => {
            console.log(`Order ID: ${order.id}, CreatedAt: ${order.createdAt}`);
            order.items.forEach(item => {
                console.log(`  - Item: ${item.productName}, SellerID: ${item.sellerId}, Price: ${item.price}`);
            });
        });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkLatestOrders();
