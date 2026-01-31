'use server';

import { prisma } from '@/utils/prisma';

const MAX_RETRIES = 3;

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: any;
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            return await fn();
        } catch (e: any) {
            lastError = e;
            if (e?.message?.includes("Can't reach database server") || e?.code === 'P1001') {
                console.warn(`[DB Retry ${i + 1}/${MAX_RETRIES}] Connection failed, retrying...`);
                await new Promise(res => setTimeout(res, 1000 * (i + 1))); // Exponentialish backoff
                continue;
            }
            throw e;
        }
    }
    throw lastError;
}

// Robust deep serializer
// Robust deep serializer using JSON to ensure plain objects
// Robust deep serializer using JSON to ensure plain objects
function serialize<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj, (key, value) => {
        // Handle Decimal conversion safely during stringification
        if (typeof value === 'object' && value !== null) {
            // Prisma Decimals often identify by constructor name or internal structure
            if ((value.constructor && value.constructor.name === 'Decimal') ||
                ('s' in value && 'e' in value && 'd' in value)) {
                return Number(value);
            }
        }
        return value;
    }));
}

export async function getPublicProducts(options?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
}) {
    const { page = 1, limit = 50, category, search } = options || {};
    const skip = (page - 1) * limit;

    try {
        const where: any = { status: 'active' };

        if (category && category !== 'All') {
            where.category = {
                equals: category,
                mode: 'insensitive'
            };
        }

        if (search) {
            where.name = {
                contains: search,
                mode: 'insensitive'
            };
        }

        const products = await withRetry(() => prisma.product.findMany({
            where,
            include: {
                seller: {
                    select: {
                        id: true,
                        shopName: true,
                        ownerName: true,
                        image: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        }));

        return serialize(products);
    } catch (e) {
        console.error("Error fetching products", e);
        return [];
    }
}

export async function getPublicSellers(options?: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = options || {};
    const skip = (page - 1) * limit;

    try {
        const sellers = await withRetry(() => prisma.seller.findMany({
            where: { status: 'active', verified: true },
            orderBy: { rating: 'desc' },
            take: limit,
            skip: skip,
            include: {
                products: {
                    where: { status: 'active' },
                    take: 3,
                    select: {
                        id: true,
                        image: true,
                        name: true,
                        price: true
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        }));

        return serialize(sellers);
    } catch (e) {
        console.error("Error fetching sellers", e);
        return [];
    }
}

export async function getPublicShop(id: string) {
    try {
        const seller = await withRetry(() => prisma.seller.findUnique({
            where: { id },
            include: {
                products: {
                    where: { status: 'active' },
                    orderBy: { createdAt: 'desc' }
                }
            }
        }));

        return serialize(seller);
    } catch (e) {
        console.error("Error fetching shop", e);
        return null;
    }
}

export async function getPublicProduct(id: string) {
    try {
        const product = await withRetry(() => prisma.product.findUnique({
            where: { id },
            include: {
                seller: {
                    select: {
                        id: true,
                        shopName: true,
                        ownerName: true,
                        image: true
                    }
                }
            }
        }));

        return serialize(product);
    } catch (e) {
        console.error("Error fetching product", e);
        return null;
    }
}
