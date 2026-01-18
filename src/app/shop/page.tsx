'use client';

import { useState, useMemo } from 'react';
import { products } from '@/data/mockData';
import { useCart } from '@/context/CartContext';

const categories = ['All', 'seeds', 'fertilizers', 'pesticides', 'equipment', 'feed', 'medicine'];

export default function ShopPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const { addToCart } = useCart();

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    const handleAddToCart = (product: any) => {
        addToCart(product);
        alert(`Added ${product.name} to cart!`);
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Marketplace</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
                {/* Sidebar Filters */}
                <aside>
                    <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
                        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Filters</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Search</label>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--glass-border)',
                                    background: 'rgba(0,0,0,0.2)',
                                    color: 'white'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Categories</label>
                            <ul style={{ listStyle: 'none' }}>
                                {categories.map((cat) => (
                                    <li key={cat} style={{ marginBottom: '0.5rem' }}>
                                        <button
                                            onClick={() => setSelectedCategory(cat)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: selectedCategory === cat ? 'var(--primary)' : 'var(--text-primary)',
                                                cursor: 'pointer',
                                                fontWeight: selectedCategory === cat ? 'bold' : 'normal',
                                                textTransform: 'capitalize',
                                                textAlign: 'left',
                                                padding: '4px 0'
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ height: '200px', background: '#eee', position: 'relative' }}>
                                <img
                                    src={product.image}
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
                                    textTransform: 'capitalize'
                                }}>
                                    {product.category}
                                </span>
                            </div>

                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{product.seller}</div>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{product.name}</h3>
                                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>₦{product.price.toLocaleString()}</span>
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

                    {filteredProducts.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                            No products found matching your criteria.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
