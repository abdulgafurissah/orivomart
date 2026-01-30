'use server';

import { prisma } from '@/utils/prisma';
import { getSession } from '@/utils/session';
import { revalidatePath } from 'next/cache';

export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' }
        });
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export async function addCategory(formData: FormData) {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return { error: 'Unauthorized' };
    }

    const name = formData.get('name') as string;
    const image = formData.get('image') as string; // Optional URL

    if (!name) {
        return { error: 'Category name is required' };
    }

    try {
        await prisma.category.create({
            data: {
                name,
                image: image || null
            }
        });
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error creating category:', error);
        return { error: 'Failed to create category' };
    }
}

export async function deleteCategory(id: string) {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return { error: 'Unauthorized' };
    }

    try {
        await prisma.category.delete({
            where: { id }
        });
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error deleting category:', error);
        return { error: 'Failed to delete category' };
    }
}
