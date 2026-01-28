import { getPublicProduct } from '@/app/actions/public-actions';
import ProductClient from './product-client';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch from DB
    const product = await getPublicProduct(id);

    if (!product) {
        return (
            <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
                <h1>Product Not Found</h1>
                <p>The product you are looking for does not exist or has been removed.</p>
                <Link href="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
                    Return Home
                </Link>
            </div>
        );
    }

    return <ProductClient product={product} />;
}
