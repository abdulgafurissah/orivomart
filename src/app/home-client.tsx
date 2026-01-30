'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from '@/components/Animations';
import { motion } from 'framer-motion';

const categories = ['All', 'electronics', 'clothing', 'home', 'beauty', 'sports', 'toys', 'groceries', 'books'];

export default function HomeClient({ products, sellers }: { products: any[], sellers: any[] }) {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const { addToCart } = useCart();

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const productCategory = product.category || 'All';
            const matchesCategory = selectedCategory === 'All' || productCategory.toLowerCase() === selectedCategory.toLowerCase();
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery, products]);

    const handleAddToCart = (product: any) => {
        // Map DB product to CartItem safely
        const cartItem: any = {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image || 'https://placehold.co/400',
            shopId: product.seller?.id || product.sellerId, // DB has seller object included
            sellerId: product.seller?.id || product.sellerId,
            shopName: product.seller?.shopName || 'Unknown Shop',
            category: product.category
        };
        addToCart(cartItem);
        alert(`Added ${product.name} to cart!`);
    };

    return (
        <div className="container">
            {/* Modern Hero Section */}
            <FadeIn>
                <div style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, #3a56d4 100%)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '4rem 2rem',
                    marginBottom: '3rem',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Background Pattern */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.1,
                        backgroundImage: 'radial-gradient(circle at 20% 50%, white 2px, transparent 2.5px)',
                        backgroundSize: '30px 30px'
                    }}></div>

                    <div className={styles.heroGrid}>
                        {/* Left Content */}
                        <div className="animate-fade-in" style={{ textAlign: 'left' }}> {/* Keep text align left on desktop, mobile can override via CSS if needed, but flex-col usually wants centered or left. CSS has text-align: center for mobile */}
                            <SlideIn delay={0.2}>
                                <span style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    padding: '6px 16px',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    fontWeight: 'bold',
                                    display: 'inline-block',
                                    marginBottom: '1rem',
                                    letterSpacing: '0.5px'
                                }}>
                                    🚀 The #1 Marketplace
                                </span>
                            </SlideIn>
                            <SlideIn delay={0.3}>
                                <h1 className={styles.heroTitle} style={{
                                    lineHeight: '1.2',
                                    marginBottom: '1.5rem',
                                    fontWeight: '800'
                                    /* fontSize moved to CSS */
                                }}>
                                    Shopping Made <br />
                                    <span style={{ color: '#ffd166' }}>Simple & Joyful</span>
                                </h1>
                            </SlideIn>
                            <SlideIn delay={0.4}>
                                <p style={{
                                    fontSize: '1.2rem',
                                    marginBottom: '2.5rem',
                                    opacity: 0.9,
                                    maxWidth: '500px',
                                    lineHeight: '1.6'
                                }}>
                                    Discover thousands of verified sellers, unique products, and enjoy fast delivery right to your doorstep.
                                </p>
                            </SlideIn>

                            <SlideIn delay={0.5}>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            const marketSection = document.getElementById('marketplace');
                                            marketSection?.scrollIntoView({ behavior: 'smooth' });
                                        }} style={{
                                            padding: '14px 28px',
                                            fontSize: '1rem',
                                            background: 'white',
                                            color: 'var(--primary)',
                                            border: 'none',
                                            borderRadius: 'var(--radius-md)',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                                        }}>
                                        Start Shopping
                                    </motion.button>
                                    <Link href="/auth/signup">
                                        <motion.div
                                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{
                                                padding: '14px 28px',
                                                fontSize: '1rem',
                                                display: 'inline-block',
                                                background: 'rgba(255,255,255,0.1)',
                                                color: 'white',
                                                border: '1px solid rgba(255,255,255,0.3)',
                                                borderRadius: 'var(--radius-md)',
                                                fontWeight: 'bold',
                                                cursor: 'pointer'
                                            }}>
                                            Become a Seller
                                        </motion.div>
                                    </Link>
                                </div>
                            </SlideIn>
                        </div>

                        {/* Right Visual (Abstract Floating Elements) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className={styles.heroVisualContainer}
                        >
                            {/* Center Circle */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                style={{
                                    width: '300px',
                                    height: '300px',
                                    borderRadius: '50%',
                                    border: '2px dashed rgba(255,255,255,0.2)',
                                    position: 'absolute',
                                    maxWidth: '100%' // Ensure no overflow
                                }}
                            />
                            <div style={{
                                width: '250px',
                                height: '250px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                                position: 'absolute',
                                maxWidth: '90%'
                            }}></div>

                            {/* Floating Card 1 */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="glass-panel" style={{
                                    position: 'absolute',
                                    top: '10%',
                                    right: '10%',
                                    padding: '15px',
                                    background: 'white',
                                    color: '#333',
                                    width: '180px',
                                    transform: 'rotate(5deg)',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                                }}>
                                <div style={{ height: '100px', background: '#f0f0f0', borderRadius: '8px', marginBottom: '10px' }}></div>
                                <div style={{ height: '10px', width: '70%', background: '#eee', borderRadius: '4px', marginBottom: '5px' }}></div>
                                <div style={{ height: '10px', width: '40%', background: '#ff9f1c', borderRadius: '4px' }}></div>
                            </motion.div>

                            {/* Floating Card 2 */}
                            <motion.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="glass-panel" style={{
                                    position: 'absolute',
                                    bottom: '10%',
                                    left: '10%',
                                    padding: '15px',
                                    background: 'white',
                                    color: '#333',
                                    width: '160px',
                                    transform: 'rotate(-5deg)',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                                    zIndex: 2
                                }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#2ecc71', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>✓</div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Verified Shop</span>
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>Trusted by 10k+ users</div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </FadeIn>

            {/* Marketplace Section */}
            <section id="marketplace" style={{ paddingBottom: '4rem' }}>
                <div className={styles.marketplaceLayout}>

                    {/* Mobile Category Dropdown (Visible only on mobile) */}
                    <div className={styles.mobileCategoryDropdown}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Select Category</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid var(--card-border)',
                                fontSize: '1rem',
                                background: 'white'
                            }}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <div style={{ marginTop: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--card-border)',
                                    background: 'white'
                                }}
                            />
                        </div>
                    </div>

                    {/* Sidebar Filters (Desktop Only) */}
                    <aside className={styles.sidebar}>
                        <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
                            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Explore</h3>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
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
                                                    width: '100%',
                                                    padding: '6px 12px',
                                                    borderRadius: 'var(--radius-sm)',
                                                    backgroundColor: selectedCategory === cat ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
                                                    transition: 'all 0.2s'
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
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem' }}>
                                {selectedCategory === 'All' ? 'Trending Products' : `Browsing ${selectedCategory}`}
                            </h2>
                            <span style={{ color: 'var(--text-secondary)' }}>{filteredProducts.length} items found</span>
                        </div>

                        <StaggerContainer className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
                            {filteredProducts.map((product) => {
                                const shop = product.seller;
                                const shopName = shop?.shopName || 'Unknown Shop';
                                const shopId = shop?.id;

                                return (
                                    <StaggerItem key={product.id}>
                                        <motion.div
                                            whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)' }}
                                            className="glass-panel"
                                            style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}
                                        >
                                            <div style={{ height: '200px', background: '#eee', position: 'relative', overflow: 'hidden' }}>
                                                <motion.img
                                                    whileHover={{ scale: 1.1 }}
                                                    transition={{ duration: 0.3 }}
                                                    src={product.image || 'https://via.placeholder.com/200'}
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
                                                {shop && (
                                                    <Link href={`/shop/${shopId}`} style={{ textDecoration: 'none' }}>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            🛍️ <span style={{ textDecoration: 'underline' }}>{shopName}</span>
                                                        </div>
                                                    </Link>
                                                )}

                                                <Link href={`/product/${product.id}`}>
                                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', cursor: 'pointer' }}>{product.name}</h3>
                                                </Link>

                                                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>GH₵ {Number(product.price).toLocaleString()}</span>
                                                    <motion.button
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleAddToCart(product)}
                                                        className="btn btn-primary"
                                                        style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                                                    >
                                                        Add
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </StaggerItem>
                                );
                            })}
                        </StaggerContainer>

                        {filteredProducts.length === 0 && (
                            <FadeIn>
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                                    No products found matching "{searchQuery}" in {selectedCategory}.
                                </div>
                            </FadeIn>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
