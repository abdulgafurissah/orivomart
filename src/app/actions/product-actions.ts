'use server';

import { prisma } from '@/utils/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/utils/session';

export async function getSellerProducts() {
    const session = await getSession();
    if (!session || session.role !== 'seller') return [];

    const seller = await prisma.seller.findUnique({
        where: { userId: session.userId }
    });

    if (!seller) return [];

    const products = await prisma.product.findMany({
        where: { sellerId: seller.id },
        orderBy: { createdAt: 'desc' }
    });

    return products.map(p => ({
        ...p,
        price: Number(p.price),
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
    }));
}

export async function createProduct(formData: FormData) {
    const session = await getSession();
    if (!session || session.role !== 'seller') return { error: 'Unauthorized' };

    const seller = await prisma.seller.findUnique({
        where: { userId: session.userId }
    });

    if (!seller) return { error: 'Seller profile not found' };

    // Helper to process image
    async function processImage(formData: FormData): Promise<string | null> {
        const file = formData.get('imageFile') as File | null;
        const existing = formData.get('existingImage') as string | null;

        if (file && file.size > 0) {
            if (file.size > 5 * 1024 * 1024) throw new Error('File too large (max 5MB)');

            const buffer = Buffer.from(await file.arrayBuffer());
            const base64 = buffer.toString('base64');
            const mimeType = file.type || 'image/jpeg';
            return `data:${mimeType};base64,${base64}`;
        }
        return existing || null;
    }

    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string);
    const description = formData.get('description') as string;

    let image: string | null = 'https://placehold.co/400x400?text=Product';
    try {
        const processed = await processImage(formData);
        if (processed) image = processed;
    } catch (e: any) {
        return { error: e.message };
    }

    if (!name || isNaN(price)) {
        return { error: 'Name and Price are required' };
    }

    try {
        const newProduct = await prisma.product.create({
            data: {
                sellerId: seller.id,
                name,
                price,
                stock: isNaN(stock) ? 0 : stock,
                description,
                image
            }
        });

        // Update product count
        await prisma.seller.update({
            where: { id: seller.id },
            data: { productsCount: { increment: 1 } }
        });

        revalidatePath('/dashboard/products');
        return {
            success: 'Product created',
            product: {
                ...newProduct,
                price: Number(newProduct.price),
                createdAt: newProduct.createdAt.toISOString(),
                updatedAt: newProduct.updatedAt.toISOString()
            }
        };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function updateProduct(formData: FormData) {
    const session = await getSession();
    if (!session || session.role !== 'seller') return { error: 'Unauthorized' };

    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string);
    const description = formData.get('description') as string;

    // Process image
    let imageUpdate: string | undefined = undefined;
    const file = formData.get('imageFile') as File | null;

    if (file && file.size > 0) {
        if (file.size > 5 * 1024 * 1024) return { error: 'File too large (max 5MB)' };
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = buffer.toString('base64');
        const mimeType = file.type || 'image/jpeg';
        imageUpdate = `data:${mimeType};base64,${base64}`;
    }

    try {
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name,
                price,
                stock,
                description,
                image: imageUpdate // Only update if new image provided
            }
        });
        revalidatePath('/dashboard/products');
        return {
            success: 'Product updated',
            product: {
                ...updatedProduct,
                price: Number(updatedProduct.price),
                createdAt: updatedProduct.createdAt.toISOString(),
                updatedAt: updatedProduct.updatedAt.toISOString()
            }
        };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function deleteProduct(id: string) {
    const session = await getSession();
    if (!session || session.role !== 'seller') return { error: 'Unauthorized' };

    try {
        // Check ownership
        const product = await prisma.product.findUnique({
            where: { id },
            include: { seller: true }
        });

        if (!product) return { error: 'Product not found' };
        if (product.seller.userId !== session.userId) return { error: 'Unauthorized' };

        await prisma.product.delete({ where: { id } });

        // Update product count
        await prisma.seller.update({
            where: { id: product.sellerId },
            data: { productsCount: { decrement: 1 } }
        });

        revalidatePath('/dashboard/products');
        return { success: 'Product deleted' };
    } catch (e: any) {
        return { error: e.message };
    }
}

export async function toggleProductStatus(id: string, currentStatus: string) {
    const session = await getSession();
    if (!session || session.role !== 'seller') return { error: 'Unauthorized' };

    try {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        await prisma.product.update({
            where: { id },
            data: { status: newStatus }
        });
        revalidatePath('/dashboard/products');
        return { success: `Product ${newStatus}` };
    } catch (e: any) {
        return { error: e.message };
    }
}
