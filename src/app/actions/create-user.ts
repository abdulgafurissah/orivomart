'use server';

import { prisma } from '@/utils/prisma';
import bcrypt from 'bcryptjs';

export async function createUser(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;
    const name = formData.get('name') as string;

    if (!email || !password || !role) {
        return { error: 'Missing required fields' };
    }

    try {
        // Check if user exists
        const existing = await prisma.profile.findUnique({ where: { email } });
        if (existing) {
            return { error: 'User with this email already exists.' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.profile.create({
            data: {
                email,
                password: hashedPassword,
                fullName: name,
                role: role
            }
        });

        return { success: true, userId: newUser.id };

    } catch (err: any) {
        console.error('Create User Error:', err);
        return { error: err.message };
    }
}
