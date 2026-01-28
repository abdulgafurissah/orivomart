
import { getPublicShop } from '@/app/actions/public-actions';
import ShopClient from './shop-client';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Note: If slug is ID, fetch by ID. If we implement custom slugs later, change logic here.
    // Currently home page links to /shop/[id]
    const shop = await getPublicShop(slug);

    if (!shop) {
        return (
            <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
                <h1 style={{ marginBottom: '1rem' }}>Shop Not Found</h1>
                <p>The shop you are looking for does not exist or has been removed.</p>
                <Link href="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
                    Return to Mall
                </Link>
            </div>
        );
    }

    return <ShopClient shop={shop as any} />;
}
