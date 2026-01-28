'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function ProductClient({ product }: { product: any }) {
    const { addToCart } = useCart();
    const shop = product.seller;

    const handleAddToCart = () => {
        // Map to CartItem
        const cartItem: any = {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image || 'https://placehold.co/400',
            shopId: shop.id,
            sellerId: shop.id,
            shopName: shop.shopName,
            description: product.description,
            category: product.category
        };
        addToCart(cartItem);
        alert(`Added ${product.name} to cart!`);
    };

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            <div className="glass-panel" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                {/* Image */}
                <div style={{ background: '#f5f5f5', borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                        src={product.image || 'https://placehold.co/400'}
                        alt={product.name}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                </div>

                {/* Info */}
                <div>
                    <div style={{ marginBottom: '1rem' }}>
                        <span style={{
                            background: 'rgba(52, 152, 219, 0.1)',
                            color: 'var(--primary)',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            textTransform: 'capitalize'
                        }}>
                            {product.category || 'General'}
                        </span>
                    </div>

                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{product.name}</h1>

                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                        GH₵ {product.price.toLocaleString()}
                    </div>

                    <div style={{ marginBottom: '2rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        {product.description || 'No description available'}
                    </div>

                    {shop && (
                        <div style={{
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '1rem',
                            marginBottom: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <img
                                src={shop.image || `https://ui-avatars.com/api/?name=${shop.shopName}`}
                                alt={shop.shopName}
                                style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                            />
                            <div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Sold by</div>
                                <Link href={`/shop/${shop.id}`} style={{ fontWeight: 'bold', fontSize: '1.1rem', textDecoration: 'none' }}>
                                    {shop.shopName} ›
                                </Link>
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={handleAddToCart}
                            className="btn btn-primary"
                            style={{ flex: 1, padding: '14px' }}
                        >
                            Add to Cart
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '14px' }}>
                            ❤
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
