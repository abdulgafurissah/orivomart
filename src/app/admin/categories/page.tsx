'use client';

import { useState, useEffect } from 'react';
import { getCategories, addCategory, deleteCategory } from '@/app/actions/category-actions';

export default function AdminCategories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setIsLoading(true);
        const data = await getCategories();
        setCategories(data);
        setIsLoading(false);
    };

    const handleAdd = async (formData: FormData) => {
        setIsSubmitting(true);
        const result = await addCategory(formData);
        if (result.error) {
            alert(result.error);
        } else {
            alert('Category added successfully!');
            // Reset form? The native form action resets if used directly, but we might want to manually refresh list
            loadCategories();
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        const result = await deleteCategory(id);
        if (result.error) {
            alert(result.error);
        } else {
            loadCategories();
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Manage Categories</h1>

            {/* Add Category Form */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Add New Category</h2>
                <form action={handleAdd} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Category Name</label>
                        <input
                            name="name"
                            required
                            placeholder="e.g. Electronics"
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary"
                        >
                            {isSubmitting ? 'Adding...' : 'Add Category'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Categories List */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Existing Categories ({categories.length})</h2>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {categories.map((cat) => (
                            <div key={cat.id} style={{
                                padding: '1rem',
                                border: '1px solid #eee',
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: '#f9f9f9'
                            }}>
                                <span style={{ fontWeight: 'bold' }}>{cat.name}</span>
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    style={{
                                        background: '#ffdddd',
                                        color: '#d32f2f',
                                        border: 'none',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                        {categories.length === 0 && <p>No categories found.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
