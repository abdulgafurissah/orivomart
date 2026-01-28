'use client';

import { useState } from 'react';
import Link from 'next/link';

// Helper to generate a consistent gradient based on string
const getGradient = (str: string) => {
    const colors = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
        'linear-gradient(to right, #fa709a 0%, #fee140 100%)',
        'linear-gradient(to top, #30cfd0 0%, #330867 100%)', // my fave
        'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(to right, #43e97b 0%, #38f9d7 100%)'
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
};

export default function SellersClient({ shops }: { shops: any[] }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredShops = shops.filter(shop =>
        (shop.shopName || shop.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-1px' }}>
                    Featured Stores
                </h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.6' }}>
                    Explore verified boutiques and official brand stores.
                    <br />Currently hosting <strong style={{ color: 'var(--primary)' }}>{shops.length}</strong> premium sellers.
                </p>
            </div>

            <div style={{ maxWidth: '600px', margin: '0 auto 4rem auto', position: 'relative' }}>
                <input
                    type="text"
                    placeholder="Search for a store..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '18px 24px',
                        paddingLeft: '50px',
                        borderRadius: '50px',
                        border: '1px solid var(--glass-border)',
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        fontSize: '1.1rem',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}
                />
                <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                    🔍
                </span>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '2.5rem'
            }}>
                {filteredShops.map((shop) => (
                    <Link href={`/shop/${shop.id}`} key={shop.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="glass-panel" style={{
                            padding: '0',
                            overflow: 'hidden',
                            borderRadius: '24px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            cursor: 'pointer',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {/* Product Gallery Preview - Larger Hero Section */}
                            {shop.products && shop.products.length > 0 ? (
                                <div style={{
                                    height: '200px',
                                    background: '#1a1a1a',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    {/* Main Product Image */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: `url(${shop.products[0]?.image || 'https://placehold.co/400'}) center/cover no-repeat`
                                    }}>
                                        {/* Gradient overlay for readability */}
                                        <div style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)'
                                        }} />
                                    </div>

                                    {/* Product Count Badge */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        left: '12px',
                                        background: 'rgba(0,0,0,0.7)',
                                        backdropFilter: 'blur(10px)',
                                        color: 'white',
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        🛍️ {shop.products.length} Products
                                    </div>

                                    {/* Verified Badge */}
                                    {shop.verified && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '12px',
                                            right: '12px',
                                            background: 'rgba(0,0,0,0.7)',
                                            backdropFilter: 'blur(10px)',
                                            color: '#2ecc71',
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            <span>✓</span> VERIFIED
                                        </div>
                                    )}

                                    {/* Product Thumbnails at Bottom */}
                                    {shop.products.length > 1 && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '12px',
                                            left: '12px',
                                            right: '12px',
                                            display: 'flex',
                                            gap: '6px',
                                            justifyContent: 'center'
                                        }}>
                                            {shop.products.slice(1, 4).map((prod: any, idx: number) => (
                                                <div key={prod.id} style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    border: '2px solid rgba(255,255,255,0.3)',
                                                    background: '#000'
                                                }}>
                                                    <img
                                                        src={prod.image || 'https://placehold.co/50'}
                                                        alt={prod.name}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </div>
                                            ))}
                                            {shop.products.length > 4 && (
                                                <div style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '8px',
                                                    background: 'rgba(0,0,0,0.8)',
                                                    border: '2px solid rgba(255,255,255,0.3)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                    color: 'white'
                                                }}>
                                                    +{shop.products.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{
                                    height: '200px',
                                    background: shop.coverImage ? `url(${shop.coverImage}) center/cover no-repeat` : getGradient(shop.shopName || shop.name),
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {shop.coverImage && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />}

                                    {/* Verified Badge */}
                                    {shop.verified && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '12px',
                                            right: '12px',
                                            background: 'rgba(0,0,0,0.7)',
                                            backdropFilter: 'blur(10px)',
                                            color: '#2ecc71',
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            <span>✓</span> VERIFIED
                                        </div>
                                    )}

                                    <div style={{ fontSize: '3rem', zIndex: 1 }}>🏪</div>
                                </div>
                            )}

                            {/* Shop Info Area */}
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                {/* Shop Logo & Rating */}
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <img
                                        src={shop.image || shop.avatar || 'https://placehold.co/60'}
                                        onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(shop.shopName || 'Shop')}&background=random`; }}
                                        alt={shop.shopName}
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '16px',
                                            objectFit: 'cover',
                                            border: '3px solid var(--glass-border)',
                                            background: 'var(--background)',
                                            flexShrink: 0
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.25rem', lineHeight: '1.2' }}>
                                            {shop.shopName || shop.name}
                                        </h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <div style={{ color: '#f1c40f', fontSize: '0.85rem' }}>
                                                {'★'.repeat(Math.round(Number(shop.rating) || 5))}{'☆'.repeat(5 - Math.round(Number(shop.rating) || 5))}
                                            </div>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                ({(Number(shop.rating) || 5.0).toFixed(1)})
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <p style={{
                                    fontSize: '0.9rem',
                                    color: 'var(--text-secondary)',
                                    marginBottom: '1rem',
                                    lineHeight: '1.5',
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical'
                                }}>
                                    {shop.description || `Welcome to ${shop.shopName}. We offer quality products and great service.`}
                                </p>

                                {/* Product Details Section */}
                                {shop.products && shop.products.length > 0 && (
                                    <div style={{
                                        marginTop: 'auto',
                                        paddingTop: '1rem',
                                        borderTop: '1px solid var(--glass-border)'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            fontSize: '0.85rem'
                                        }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>Starting from</span>
                                            <span style={{
                                                fontSize: '1.1rem',
                                                fontWeight: 'bold',
                                                color: 'var(--primary)'
                                            }}>
                                                GH₵ {Math.min(...shop.products.map((p: any) => Number(p.price) || 0)).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {(!shop.products || shop.products.length === 0) && (
                                    <div style={{
                                        marginTop: 'auto',
                                        padding: '1rem',
                                        textAlign: 'center',
                                        background: 'rgba(255,255,255,0.02)',
                                        borderRadius: '12px',
                                        border: '1px dashed var(--glass-border)'
                                    }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            Shop opening soon
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
