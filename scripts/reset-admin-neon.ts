
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@sahalmall.com';
    const password = 'Admin@123';

    console.log(`Resetting Admin Password in Neon for: ${email}`);

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.profile.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'admin',
            fullName: 'System Admin'
        },
        create: {
            email,
            password: hashedPassword,
            role: 'admin',
            fullName: 'System Admin'
        }
    });

    console.log('✅ Admin Password Reset!');
    console.log('Email:', email);
    console.log('Password:', password);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
