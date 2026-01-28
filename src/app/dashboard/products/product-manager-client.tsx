'use client';

import { useState, useEffect } from 'react';
import { createProduct, updateProduct, deleteProduct, toggleProductStatus } from '@/app/actions/product-actions';
import { useRouter } from 'next/navigation';

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number | unknown; // Decimal comes as string or unknown from server actions often
    stock: number;
    image: string | null;
    status: string;
}

export default function ProductManagerClient({ initialProducts }: { initialProducts: any[] }) {
    // Note: initialProducts comes from Prisma, Decimal might be tricky in client. 
    // Usually standard fetch converts it, but passing directly from server component needs care.
    // We'll treat price as number/string.

    const [products, setProducts] = useState(initialProducts);

    // Sync with server state when router.refresh updates initialProducts
    useEffect(() => {
        setProducts(initialProducts);
    }, [initialProducts]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleSave(formData: FormData) {
        setIsLoading(true);
        try {
            let res: any;
            if (editingProduct) {
                formData.append('id', editingProduct.id);
                res = await updateProduct(formData);

                if (res.error) {
                    alert(res.error);
                } else if (res.success && res.product) {
                    // Update local state
                    setProducts(products.map(p => p.id === res.product.id ? res.product : p));
                    setIsModalOpen(false);
                    router.refresh(); // Sync server state in background
                }
            } else {
                res = await createProduct(formData);

                if (res.error) {
                    alert(res.error);
                } else if (res.success && res.product) {
                    setProducts([res.product, ...products]);
                    setIsModalOpen(false);
                    router.refresh(); // Sync server state in background
                }
            }
        } catch (e: any) {
            alert('An unexpected error occurred: ' + e.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this product permanently?')) return;
        const res = await deleteProduct(id);
        if (res.success) {
            setProducts(products.filter(p => p.id !== id));
        } else {
            alert(res.error);
        }
    }

    async function handleToggle(id: string, status: string) {
        const res = await toggleProductStatus(id, status);
        if (res.success) {
            // Optimistic update
            setProducts(products.map(p => p.id === id ? { ...p, status: status === 'active' ? 'suspended' : 'active' } : p));
        }
    }

    function openAdd() {
        setEditingProduct(null);
        setIsModalOpen(true);
    }

    function openEdit(p: any) {
        setEditingProduct(p);
        setIsModalOpen(true);
    }

    return (
        <div>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" onClick={openAdd} className="btn btn-primary">+ Add Product</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                {products.map(p => (
                    <div key={p.id} className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '200px', background: '#333', position: 'relative' }}>
                            {p.image ? (
                                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>No Image</div>
                            )}
                            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                <span style={{
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    background: p.status === 'active' ? '#2ecc71' : '#e74c3c',
                                    color: 'white'
                                }}>
                                    {p.status.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem', flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{p.name}</h3>
                                <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>GH₵ {Number(p.price).toFixed(2)}</div>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', height: '40px', overflow: 'hidden' }}>
                                {p.description || 'No description'}
                            </p>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Stock: {p.stock}</div>
                        </div>

                        <div style={{ padding: '1rem', borderTop: '1px solid var(--card-border)', display: 'flex', gap: '1rem' }}>
                            <button type="button" onClick={() => openEdit(p)} style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid var(--text-secondary)', borderRadius: '4px', color: 'var(--text-primary)', cursor: 'pointer' }}>Edit</button>
                            <button type="button" onClick={() => handleToggle(p.id, p.status)} style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid var(--accent)', borderRadius: '4px', color: 'var(--accent)', cursor: 'pointer' }}>
                                {p.status === 'active' ? 'Suspend' : 'Activate'}
                            </button>
                            <button type="button" onClick={() => handleDelete(p.id)} style={{ padding: '8px', background: 'transparent', border: '1px solid #e74c3c', borderRadius: '4px', color: '#e74c3c', cursor: 'pointer' }}>🗑️</button>
                        </div>
                    </div>
                ))}
            </div>

            {products.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                    No products found. Start by adding one!
                </div>
            )}

            {/* MODAL */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        <form action={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Product Name</label>
                                <input name="name" defaultValue={editingProduct?.name} required type="text" style={{ width: '100%', padding: '10px', borderRadius: '4px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Price (GHS)</label>
                                <input name="price" defaultValue={editingProduct ? Number(editingProduct.price) : ''} required type="number" step="0.01" style={{ width: '100%', padding: '10px', borderRadius: '4px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Stock Quantity</label>
                                <input name="stock" defaultValue={editingProduct?.stock ?? 1} required type="number" style={{ width: '100%', padding: '10px', borderRadius: '4px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Product Image</label>
                                {/* Hidden input to store previous image URL if editing and no new file selected */}
                                <input type="hidden" name="existingImage" value={editingProduct?.image || ''} />

                                <input
                                    name="imageFile"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            if (file.size > 5 * 1024 * 1024) { // 5MB
                                                alert('File size must be less than 5MB');
                                                e.target.value = ''; // Clear input
                                            }
                                        }
                                    }}
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', background: 'var(--input-bg)', border: '1px solid var(--input-border)' }}
                                />
                                {editingProduct?.image && (
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        Current: <a href={editingProduct.image} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>View Image</a>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                                <textarea name="description" defaultValue={editingProduct?.description} rows={4} style={{ width: '100%', padding: '10px', borderRadius: '4px' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--text-secondary)', color: 'var(--text-secondary)', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ flex: 1 }}>
                                    {isLoading ? 'Saving...' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
