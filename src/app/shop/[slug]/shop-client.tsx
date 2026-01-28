'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useState } from 'react';

// Define types locally or import
interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    category: string | null;
    // ...
}

interface Shop {
    id: string;
    shopName: string;
    ownerName: string;
    description: string | null;
    image: string | null; // avatar
    coverImage: string | null; // banner
    products: Product[];
    // ...
}

export default function ShopClient({ shop }: { shop: Shop }) {
    const { addToCart } = useCart();

    const handleAddToCart = (product: Product) => {
        // Adapt product to cart item (must match Product interface from mockData)
        const cartItem: any = {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image || 'https://placehold.co/400',
            category: product.category || 'General',
            shopId: shop.id,
            sellerId: shop.id, // For checkout actions
            rating: 5,
            description: product.description || '',
        };
        addToCart(cartItem);
        alert(`Added ${product.name} to cart!`);
    };

    if (!shop) return <div>Shop not found</div>;

    const products = shop.products || [];

    // Fallback images
    const coverImage = shop.coverImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80';
    const avatar = shop.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(shop.shopName);

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Shop Header / Banner */}
            <div style={{
                height: '350px',
                backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${coverImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '2rem'
            }}>
                <div className="container" style={{ display: 'flex', alignItems: 'flex-end', gap: '2rem' }}>
                    <img
                        src={avatar}
                        alt={shop.shopName}
                        style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            border: '4px solid white',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                        }}
                    />
                    <div style={{ color: 'white', marginBottom: '1rem' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0 }}>{shop.shopName}</h1>
                        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>{shop.ownerName}</p>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '2rem' }}>
                {/* Shop Description */}
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem' }}>
                    <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>About Us</h2>
                    <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                        {shop.description || 'No description provided.'}
                    </p>
                </div>

                {/* Products Section */}
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Store Products</h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
                    {products.map((product) => (
                        <div key={product.id} className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ height: '220px', background: '#eee', position: 'relative' }}>
                                <img
                                    src={product.image || 'https://via.placeholder.com/300'}
                                    alt={product.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <span style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'rgba(0,0,0,0.6)',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                    textTransform: 'capitalize',
                                    color: 'white'
                                }}>
                                    {product.category || 'General'}
                                </span>
                            </div>

                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <Link href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', cursor: 'pointer', color: 'var(--text-primary)' }}>{product.name}</h3>
                                </Link>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {product.description || ''}
                                </p>
                                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>GH₵ {Number(product.price).toLocaleString()}</span>
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="btn btn-primary"
                                        style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {products.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                            No products listed in this shop yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
