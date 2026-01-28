
import { getSellerProducts } from '@/app/actions/product-actions';
import ProductManagerClient from './product-manager-client';

export const dynamic = 'force-dynamic';

export default async function ProductsValidPage() {
    const products = await getSellerProducts();

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>My Products</h1>
            <ProductManagerClient initialProducts={products} />
        </div>
    );
}
