
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSeller() {
    try {
        const sellerId = '36ace52c-9566-4701-a6a3-09fdb3a535c1';
        const seller = await prisma.seller.findUnique({
            where: { id: sellerId },
            include: { profile: true } // Assuming relation to User/Profile
        });

        if (seller) {
            console.log("Seller Found:");
            console.log(`  ID: ${seller.id}`);
            console.log(`  Shop Name: ${seller.shopName}`);
            console.log(`  Owner Name: ${seller.ownerName}`);
            console.log(`  User ID (Profile ID): ${seller.userId}`);
            if (seller.profile) {
                console.log(`  Profile Email: ${seller.profile.email}`);
            }
        } else {
            console.log("Seller NOT found with ID:", sellerId);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkSeller();
