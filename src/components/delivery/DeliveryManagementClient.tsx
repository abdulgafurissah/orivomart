'use client';

import { useState } from 'react';
import { createCourier, deleteCourier, assignDelivery } from '@/app/actions/delivery-actions';

interface DeliveryClientProps {
    deliveries: any[];
    couriers: any[];
}

export default function DeliveryManagementClient({ deliveries, couriers }: DeliveryClientProps) {
    const [tab, setTab] = useState<'shipments' | 'couriers'>('shipments');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showAddCourier, setShowAddCourier] = useState(false);

    // Add Courier Form State
    const [newCourier, setNewCourier] = useState({ fullName: '', email: '', password: '' });
    const [actionMsg, setActionMsg] = useState('');

    const [searchTerm, setSearchTerm] = useState('');

    const filteredDeliveries = deliveries.filter(d => {
        const matchesStatus = filterStatus === 'all' || d.delivery_status === filterStatus;

        let matchesSearch = true;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const tracking = (d.tracking_code || '').toLowerCase();
            // Check seller or sender address
            const sellerAddress = (d.seller?.shop_name || '').toLowerCase();
            const recipientAddress = d.order?.shipping_details ?
                (typeof d.order.shipping_details === 'string'
                    ? JSON.stringify(d.order.shipping_details).toLowerCase()
                    : JSON.stringify(d.order.shipping_details).toLowerCase())
                : '';

            matchesSearch = tracking.includes(term) || sellerAddress.includes(term) || recipientAddress.includes(term);
        }

        return matchesStatus && matchesSearch;
    });

    async function handleAddCourier(e: React.FormEvent) {
        e.preventDefault();
        setActionMsg('Creating...');
        const formData = new FormData();
        formData.append('fullName', newCourier.fullName);
        formData.append('email', newCourier.email);
        formData.append('password', newCourier.password);

        const res = await createCourier(formData);
        if (res.error) setActionMsg(`Error: ${res.error}`);
        else {
            setActionMsg('Success!');
            setShowAddCourier(false);
            setNewCourier({ fullName: '', email: '', password: '' });
        }
    }

    async function handleDeleteCourier(id: string) {
        if (!confirm('Are you sure you want to delete this courier?')) return;
        const res = await deleteCourier(id);
        if (res.error) alert(res.error);
    }

    async function handleAssign(orderItemId: string, courierId: string) {
        // If courierId is empty string, pass null
        const res = await assignDelivery(orderItemId, courierId || null);
        if (res.error) alert(res.error);
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Delivery Management</h1>
                <div style={{ display: 'flex', gap: '1rem', background: 'var(--card-bg)', padding: '5px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)' }}>
                    <button
                        onClick={() => setTab('shipments')}
                        className={`btn ${tab === 'shipments' ? 'btn-primary' : ''}`}
                        style={{
                            background: tab === 'shipments' ? undefined : 'transparent',
                            border: 'none',
                            color: tab === 'shipments' ? 'white' : 'var(--text-secondary)',
                            fontWeight: tab === 'shipments' ? '600' : 'normal'
                        }}
                    >
                        Active Shipments
                    </button>
                    <button
                        onClick={() => setTab('couriers')}
                        className={`btn ${tab === 'couriers' ? 'btn-primary' : ''}`}
                        style={{
                            background: tab === 'couriers' ? undefined : 'transparent',
                            border: 'none',
                            color: tab === 'couriers' ? 'white' : 'var(--text-secondary)',
                            fontWeight: tab === 'couriers' ? '600' : 'normal'
                        }}
                    >
                        Staff (Couriers)
                    </button>
                </div>
            </div>

            {/* TAB: SHIPMENTS */}
            {tab === 'shipments' && (
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '5px' }}>
                        {['all', 'pending_pickup', 'in_transit', 'delivered', 'cancelled'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                style={{
                                    padding: '6px 16px',
                                    borderRadius: '20px',
                                    border: '1px solid var(--card-border)',
                                    background: filterStatus === status ? 'var(--primary)' : 'var(--surface-hover)',
                                    color: filterStatus === status ? 'white' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                {status.replace('_', ' ').toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <input
                            type="text"
                            placeholder="Search by Tracking ID, Shop Name, or Address..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--card-border)',
                                background: 'var(--input-bg)',
                                color: 'var(--text-primary)'
                            }}
                        />
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--card-border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                                    <th style={{ padding: '1rem' }}>Tracking ID</th>
                                    <th style={{ padding: '1rem' }}>Details</th>
                                    <th style={{ padding: '1rem' }}>Route</th>
                                    <th style={{ padding: '1rem' }}>Assign Courier</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDeliveries.length > 0 ? filteredDeliveries.map((item) => {
                                    const details = item.order?.shipping_details ?
                                        (typeof item.order.shipping_details === 'string' ? JSON.parse(item.order.shipping_details) : item.order.shipping_details)
                                        : null;

                                    // Payer info
                                    const payer = details?.payer || 'sender';
                                    const isPendingApproval = item.delivery_status === 'pending_quote' || item.delivery_status === 'pending_approval';
                                    const isPendingPayment = item.delivery_status === 'waiting_payment' || item.delivery_status === 'pending_payment';

                                    return (
                                        <tr key={item.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                                            <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 'bold' }}>#{item.tracking_code || 'PENDING'}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: 'bold' }}>{item.product_name}</div>
                                                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Qty: {item.quantity}</div>
                                                {isPendingApproval && <div style={{ color: '#e67e22', fontWeight: 'bold', fontSize: '0.8rem', marginTop: '5px' }}>Needs Manager Approval</div>}
                                                {isPendingPayment && <div style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '0.8rem', marginTop: '5px' }}>Waiting for Sender Payment</div>}
                                            </td>
                                            <td style={{ fontSize: '0.9rem', padding: '1rem' }}>
                                                {item.seller ? (
                                                    <>
                                                        <div><span style={{ color: 'var(--accent)' }}>FROM:</span> {item.seller.shop_name}</div>
                                                        <div style={{ marginTop: '4px' }}><span style={{ color: 'var(--primary)' }}>TO:</span> {
                                                            details ? details.address : 'N/A'
                                                        }</div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div>
                                                            <span style={{ color: '#9b59b6', fontWeight: 'bold' }}>EXTERNAL / {payer.toUpperCase()} PAYS</span>
                                                        </div>
                                                        <div style={{ marginTop: '4px' }}>
                                                            <span style={{ color: 'var(--accent)' }}>PICKUP:</span> {details?.sender?.address}
                                                        </div>
                                                        <div style={{ marginTop: '4px' }}>
                                                            <span style={{ color: 'var(--primary)' }}>DROP:</span> {details?.receiver?.address}
                                                        </div>
                                                    </>
                                                )}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                {/* ACTION BUTTONS BASED ON STATUS */}
                                                {isPendingApproval ? (
                                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                        <input
                                                            type="number"
                                                            defaultValue={item.price}
                                                            id={`price-${item.id}`}
                                                            style={{ width: '80px', padding: '6px', borderRadius: '4px' }}
                                                        />
                                                        <button
                                                            onClick={async () => {
                                                                const priceInput = document.getElementById(`price-${item.id}`) as HTMLInputElement;
                                                                const finalPrice = parseFloat(priceInput.value);
                                                                if (!confirm(`Confirm shipping price at GH₵ ${finalPrice}?`)) return;

                                                                const { approveShipment } = await import('@/app/actions/manager-actions');
                                                                const res = await approveShipment(item.id, finalPrice);
                                                                if (res.error) alert(res.error);
                                                            }}
                                                            className="btn btn-primary"
                                                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                                        >
                                                            Approve
                                                        </button>
                                                    </div>
                                                ) : isPendingPayment ? (
                                                    <div>
                                                        <div style={{ marginBottom: '5px', fontSize: '0.8rem' }}>Price: GH₵ {item.price}</div>
                                                        <button
                                                            onClick={async () => {
                                                                if (!confirm("Manually mark this as paid?")) return;
                                                                const { markAsPaid } = await import('@/app/actions/manager-actions');
                                                                const res = await markAsPaid(item.id);
                                                                if (res.error) alert(res.error);
                                                            }}
                                                            className="btn btn-secondary"
                                                            style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#2ecc71', borderColor: '#2ecc71' }}
                                                        >
                                                            Mark Paid
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <select
                                                        defaultValue={item.courier_id || ''}
                                                        onChange={(e) => handleAssign(item.id, e.target.value)}
                                                        style={{
                                                            padding: '8px',
                                                            width: '100%',
                                                            borderRadius: 'var(--radius-sm)'
                                                        }}
                                                    >
                                                        <option value="">-- Unassigned --</option>
                                                        {couriers.map(c => (
                                                            <option key={c.id} value={c.id}>{c.full_name}</option>
                                                        ))}
                                                    </select>
                                                )}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600',
                                                    background:
                                                        item.delivery_status === 'delivered' ? 'rgba(46, 204, 113, 0.2)' :
                                                            item.delivery_status === 'in_transit' ? 'rgba(52, 152, 219, 0.2)' :
                                                                'rgba(241, 196, 15, 0.2)',
                                                    color:
                                                        item.delivery_status === 'delivered' ? '#2ecc71' :
                                                            item.delivery_status === 'in_transit' ? '#3498db' :
                                                                '#f1c40f'
                                                }}>
                                                    {item.delivery_status.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                }) : (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                            No shipments found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB: COURIERS */}
            {tab === 'couriers' && (
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h2 style={{ margin: 0 }}>Active Riders</h2>
                        <button onClick={() => setShowAddCourier(!showAddCourier)} className="btn btn-primary">
                            {showAddCourier ? 'Cancel' : '+ Add New Rider'}
                        </button>
                    </div>

                    {showAddCourier && (
                        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--surface-hover)', borderRadius: 'var(--radius-md)' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Register New Rider</h3>
                            <form onSubmit={handleAddCourier} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Full Name</label>
                                    <input required type="text" value={newCourier.fullName} onChange={e => setNewCourier({ ...newCourier, fullName: e.target.value })} placeholder="John Doe" style={{ padding: '10px', borderRadius: 'var(--radius-sm)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Email</label>
                                    <input required type="email" value={newCourier.email} onChange={e => setNewCourier({ ...newCourier, email: e.target.value })} placeholder="rider@orivomart.com" style={{ padding: '10px', borderRadius: 'var(--radius-sm)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Password</label>
                                    <input required type="password" value={newCourier.password} onChange={e => setNewCourier({ ...newCourier, password: e.target.value })} placeholder="Secret123" style={{ padding: '10px', borderRadius: 'var(--radius-sm)' }} />
                                </div>
                                <button type="submit" className="btn btn-primary">Create Rider</button>
                            </form>
                            {actionMsg && <div style={{ marginTop: '1rem', color: actionMsg.startsWith('Error') ? 'red' : 'green' }}>{actionMsg}</div>}
                        </div>
                    )}

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--card-border)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '1rem' }}>Name</th>
                                <th style={{ padding: '1rem' }}>Email</th>
                                <th style={{ padding: '1rem' }}>Joined</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {couriers.length > 0 ? couriers.map((courier) => (
                                <tr key={courier.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{courier.fullName || 'N/A'}</td>
                                    <td style={{ padding: '1rem' }}>{courier.email}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                                        {new Date(courier.created_at || new Date()).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>Active</span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <button onClick={() => handleDeleteCourier(courier.id)} className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem', color: '#e74c3c', borderColor: '#e74c3c' }}>Delete</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        No active riders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
