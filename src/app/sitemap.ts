
import { MetadataRoute } from 'next';
import { getPublicProducts, getPublicSellers } from '@/app/actions/public-actions';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://orivomart.com';

    // Static routes
    const routes = [
        '',
        '/sellers',
        '/track',
        '/auth/signin',
        '/auth/signup',
        '/terms',
        '/privacy',
        '/dispute-policy',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic products
    const products = await getPublicProducts();
    const productRoutes = products.map((product: any) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: new Date(product.updatedAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Dynamic shops
    const sellers = await getPublicSellers();
    const sellerRoutes = sellers.map((seller: any) => ({
        url: `${baseUrl}/shop/${seller.id}`,
        lastModified: new Date(seller.createdAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [...routes, ...productRoutes, ...sellerRoutes];
}
