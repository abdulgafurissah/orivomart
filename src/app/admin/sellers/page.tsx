'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { getSellersList, updateSellerStatus, deleteSeller as deleteSellerAction } from '@/app/actions/admin-actions'; // Alias to avoid conflict

interface Seller {
    id: string;
    shopName: string;
    ownerName: string;
    status: 'pending' | 'active' | 'suspended' | 'rejected';
    paystackSubaccountCode: string;
    createdAt: string;
    email: string;
    // KYC Fields
    ghanaCardNum?: string;
    businessAddress?: string;
    businessRegNum?: string;
    homeAddress?: string;
    gpsAddress?: string;
    kycDocUrl?: string;
}

export default function SellersPage() {
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Basic check - In a real app we'd check strict RLS or Admin Role context
    // Here we'll just fetch all data. If RLS fails, we get empty list.

    useEffect(() => {
        fetchSellers();
    }, []);

    const fetchSellers = async () => {
        try {
            const res = await getSellersList();
            if (res.error) throw new Error(res.error);
            // Type assertion or mapping if needed, but Prisma returns objects matching our interface roughly (dates might work as strings or Dates)
            setSellers(res.data as any || []);
        } catch (err) {
            console.error('Error fetching sellers:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        if (!confirm(`Are you sure you want to mark this seller as ${newStatus}?`)) return;

        try {
            const res = await updateSellerStatus(id, newStatus);
            if (res.error) throw new Error(res.error);

            // Update local state
            setSellers(sellers.map(s => s.id === id ? { ...s, status: newStatus as any } : s));
            alert(`Seller marked as ${newStatus}`);

        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status');
        }
    };

    const deleteSeller = async (id: string) => {
        if (!confirm('Are you sure you want to PERMANENTLY DELETE this seller? This cannot be undone.')) return;

        try {
            const res = await deleteSellerAction(id);
            if (res.error) throw new Error(res.error);

            setSellers(sellers.filter(s => s.id !== id));
            alert('Seller deleted');
        } catch (err) {
            console.error('Error deleting seller:', err);
            alert('Failed to delete seller');
        }
    };

    if (loading) return <div className="container" style={{ padding: '4rem' }}>Loading Admin Dashboard...</div>;

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <h1 style={{ marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                Admin Dashboard
            </h1>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>Manage Mall Shops</h3>
                    <button className="btn btn-secondary" onClick={fetchSellers}>Refresh List</button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ padding: '10px' }}>Shop Name</th>
                                <th style={{ padding: '10px' }}>Owner</th>
                                <th style={{ padding: '10px' }}>Subaccount</th>
                                <th style={{ padding: '10px' }}>Status</th>
                                <th style={{ padding: '10px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sellers.map((seller) => {
                                // Since we removed Supabase Client, we can't construct signed URLs dynamically here easily without it. 
                                // Assuming kycDocUrl is a public path or we just show a placeholder for now.
                                const kycUrl = seller.kycDocUrl ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/kyc-documents/${seller.kycDocUrl}` : null;

                                return (
                                    <tr key={seller.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{ fontWeight: 'bold' }}>{seller.shopName}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{seller.ownerName}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{seller.email}</div>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{ fontSize: '0.9rem' }}>{seller.businessAddress}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Reg: {seller.businessRegNum}</div>
                                            {seller.gpsAddress && (
                                                <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '4px' }}>
                                                    📍 {seller.gpsAddress}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{ fontSize: '0.8rem' }}>ID: {seller.ghanaCardNum}</div>
                                            {kycUrl ? (
                                                <a href={kycUrl} target="_blank" rel="noopener noreferrer"
                                                    style={{ display: 'inline-block', marginTop: '4px', fontSize: '0.8rem', color: '#3498db', textDecoration: 'underline' }}>
                                                    View Document ↗
                                                </a>
                                            ) : (
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No Doc</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <StatusBadge status={seller.status || 'pending'} />
                                        </td>
                                        <td style={{ padding: '12px', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {seller.status !== 'active' && (
                                                <button
                                                    onClick={() => updateStatus(seller.id, 'active')}
                                                    className="btn btn-primary"
                                                    style={{ padding: '6px 10px', fontSize: '0.8rem', background: '#2ecc71', borderColor: '#27ae60' }}
                                                    title="Approve Shop"
                                                >
                                                    Approve
                                                </button>
                                            )}
                                            {seller.status !== 'suspended' && (
                                                <button
                                                    onClick={() => updateStatus(seller.id, 'suspended')}
                                                    className="btn btn-secondary"
                                                    style={{ padding: '6px 10px', fontSize: '0.8rem', color: '#f39c12', borderColor: '#f39c12' }}
                                                    title="Suspend Shop"
                                                >
                                                    Suspend
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteSeller(seller.id)}
                                                className="btn btn-secondary"
                                                style={{ padding: '6px 10px', fontSize: '0.8rem', color: '#e74c3c', borderColor: '#e74c3c' }}
                                                title="Delete Shop"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                            {sellers.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        No sellers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}

function StatusBadge({ status }: { status: string }) {
    let color = '#ccc';
    switch (status) {
        case 'active': color = '#2ecc71'; break;
        case 'suspended': color = '#f39c12'; break;
        case 'rejected': color = '#e74c3c'; break;
        case 'pending': default: color = '#3498db'; break;
    }

    return (
        <span style={{
            color,
            border: `1px solid ${color}`,
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            fontWeight: 'bold'
        }}>
            {status}
        </span>
    );
}
