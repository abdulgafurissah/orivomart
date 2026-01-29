'use client';

import { useEffect, useState } from 'react';
import { createUser } from '@/app/actions/create-user';
import { getAllUsers, updateUserRole, deleteUser } from '@/app/actions/user-management';

interface Profile {
    id: string;
    email: string;
    role: string;
    created_at: string;
    full_name?: string;
}

export default function UserManagement() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const data = await getAllUsers();
        setUsers(data as any[]);
        setLoading(false);
    };

    const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsCreating(true);
        const formData = new FormData(e.currentTarget);

        const result = await createUser(formData);

        if (result.error) {
            alert('Error: ' + result.error);
        } else {
            alert('User created successfully!');
            setShowCreate(false);
            fetchUsers(); // Refresh list
        }
        setIsCreating(false);
    };

    const updateRole = async (userId: string, newRole: string) => {
        if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

        const result = await updateUserRole(userId, newRole);

        if (result.error) {
            alert('Failed to update role');
            console.error(result.error);
        } else {
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to PERMANENTLY delete this user? This action cannot be undone.')) return;

        const result = await deleteUser(userId);
        if (result.error) {
            alert(result.error);
        } else {
            alert('User deleted successfully');
            setUsers(users.filter(u => u.id !== userId));
        }
    };

    if (loading) return <div>Loading Users...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>User Management</h1>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="btn btn-primary"
                >
                    {showCreate ? 'Cancel' : '+ Create New User'}
                </button>
            </div>

            {showCreate && (
                <div className="glass-panel" style={{ marginBottom: '2rem', border: '1px solid var(--primary)' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Create System User</h3>
                    <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#f39c12' }}>
                        Create a new user directly in Neon Database.
                    </p>
                    <form onSubmit={handleCreateUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input name="name" type="text" placeholder="Full Name" required style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid #555', color: 'white' }} />
                        <input name="email" type="email" placeholder="Email" required style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid #555', color: 'white' }} />
                        <input name="password" type="text" placeholder="Password" required style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid #555', color: 'white' }} />

                        <select name="role" style={{ padding: '8px', background: '#333', color: 'white' }}>
                            <option value="delivery_manager">Delivery Manager</option>
                            <option value="courier">Courier</option>
                            <option value="admin">Admin</option>
                            <option value="seller">Seller</option>
                            <option value="buyer">Buyer</option>
                        </select>

                        <button
                            type="submit"
                            disabled={isCreating}
                            className="btn btn-secondary"
                            style={{ gridColumn: 'span 2', background: 'var(--primary)', color: 'white' }}
                        >
                            {isCreating ? 'Creating...' : 'Create Account'}
                        </button>
                    </form>
                </div>
            )}

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '10px' }}>ID / Name</th>
                            <th style={{ padding: '10px' }}>Role</th>
                            <th style={{ padding: '10px' }}>Joined</th>
                            <th style={{ padding: '10px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '12px' }}>
                                    <div style={{ fontWeight: 'bold' }}>{user.full_name || 'Unknown'}</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7, fontFamily: 'monospace' }}>{user.id}</div>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        background: user.role === 'admin' ? '#e74c3c' : user.role === 'delivery_manager' ? '#9b59b6' : '#3498db',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        textTransform: 'capitalize'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '12px', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <select
                                        value={user.role}
                                        onChange={(e) => updateRole(user.id, e.target.value)}
                                        disabled={user.role === 'admin'}
                                        style={{
                                            background: 'rgba(0,0,0,0.3)',
                                            color: user.role === 'admin' ? '#999' : 'white',
                                            border: '1px solid var(--glass-border)',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            cursor: user.role === 'admin' ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        <option value="buyer">Buyer</option>
                                        <option value="seller">Seller</option>
                                        <option value="delivery_manager">Delivery Mgr</option>
                                        <option value="courier">Courier</option>
                                    </select>

                                    {user.role !== 'admin' && (
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="btn"
                                            style={{
                                                padding: '4px 8px',
                                                fontSize: '0.8rem',
                                                background: 'rgba(231, 76, 60, 0.2)',
                                                color: '#e74c3c',
                                                border: '1px solid #e74c3c'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
