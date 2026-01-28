
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkAndFixSeller() {
    try {
        const email = 'seller@sahalmall.com';
        const user = await prisma.profile.findUnique({ where: { email } });

        if (user) {
            console.log(`User ${email} exists.`);
            console.log('Role:', user.role);

            // Check password
            const isValid = await bcrypt.compare('password123', user.password);
            console.log('Password valid:', isValid);

            if (!isValid) {
                console.log('Updating password to password123...');
                const hashedPassword = await bcrypt.hash('password123', 10);
                await prisma.profile.update({
                    where: { email },
                    data: { password: hashedPassword }
                });
                console.log('Password updated.');
            }
        } else {
            console.log(`User ${email} DOES NOT exist. Creating...`);
            const hashedPassword = await bcrypt.hash('password123', 10);
            await prisma.profile.create({
                data: {
                    email,
                    password: hashedPassword,
                    fullName: 'Test Seller',
                    role: 'seller',
                    seller: {
                        create: {
                            shopName: 'Test Shop',
                            ownerName: 'Test Seller',
                            email: email,
                            status: 'active'
                        }
                    }
                }
            });
            console.log('User created.');
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkAndFixSeller();
