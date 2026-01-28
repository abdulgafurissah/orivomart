import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@sahalmall.com';

    console.log(`Seeding admin user: ${email}...`);

    const admin = await prisma.profile.upsert({
        where: { email },
        update: {
            role: 'admin', // Ensure role is admin if exists
            fullName: 'System Admin'
        },
        create: {
            email,
            role: 'admin',
            fullName: 'System Admin',
            password: '$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // Placeholder hash
            // We don't set ID, let it auto-generate UUID
        },
    });

    console.log('Admin user created/updated successfully:');
    console.log(admin);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
