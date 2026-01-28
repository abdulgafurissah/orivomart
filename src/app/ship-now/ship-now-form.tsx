'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { createIndependentDelivery, calculateShippingQuote } from '@/app/actions/independent-delivery-actions';

export default function ShipNowForm({ user }: { user?: any }) {
    const [status, setStatus] = useState<{ type: 'success' | 'error', text: string, code?: string, price?: number } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const searchParams = useSearchParams();

    const defaultSenderName = searchParams.get('senderName') || (user?.email || '');
    const defaultSenderPhone = searchParams.get('senderPhone') || '';
    const defaultSenderAddress = searchParams.get('senderAddress') || '';

    const defaultReceiverName = searchParams.get('receiverName') || '';
    const defaultReceiverPhone = searchParams.get('receiverPhone') || '';
    const defaultReceiverAddress = searchParams.get('receiverAddress') || '';
    const defaultItemDesc = searchParams.get('itemDesc') || '';

    const [formDataState, setFormDataState] = useState({
        weightCategory: 'small',
        serviceType: 'standard'
    });

    const [estimatedCost, setEstimatedCost] = useState<number>(20); // Default base

    // Recalculate cost when options change
    useEffect(() => {
        calculateShippingQuote(formDataState.weightCategory, formDataState.serviceType)
            .then(res => setEstimatedCost(res.price));
    }, [formDataState.weightCategory, formDataState.serviceType]);


    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setStatus(null);

        const res = await createIndependentDelivery(formData);

        setIsLoading(false);
        if (res.error) {
            setStatus({ type: 'error', text: res.error });
        } else if (res.success) {
            setStatus({ type: 'success', text: res.success, code: res.trackingCode, price: res.price });
            (document.getElementById('shipForm') as HTMLFormElement)?.reset();
        }
    }

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '900px' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Ship with Sahal Logistics</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                    Reliable delivery, tailored to your needs.
                </p>
            </div>

            {status && (
                <div style={{
                    padding: '2rem',
                    marginBottom: '2rem',
                    borderRadius: 'var(--radius-md)',
                    background: status.type === 'error' ? 'rgba(231, 76, 60, 0.1)' : 'rgba(46, 204, 113, 0.1)',
                    border: `1px solid ${status.type === 'error' ? '#e74c3c' : '#2ecc71'}`,
                    textAlign: 'center'
                }}>
                    <h3 style={{ color: status.type === 'error' ? '#e74c3c' : '#2ecc71', marginBottom: '0.5rem' }}>
                        {status.type === 'error' ? 'Something went wrong' : 'Order Successfully Placed!'}
                    </h3>
                    <p>{status.text}</p>
                    {status.code && (
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <div style={{ padding: '10px 20px', background: 'white', borderRadius: '4px', fontWeight: 'bold', fontSize: '1.2rem', color: '#333' }}>
                                TRACKING: {status.code}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <form id="shipForm" action={handleSubmit} className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                    {/* SENDER */}
                    <div>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--primary)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>Pickup (From)</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Sender Name</label>
                                <input name="senderName" defaultValue={defaultSenderName} required type="text" placeholder="Your Name" style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Sender Phone</label>
                                <input name="senderPhone" defaultValue={defaultSenderPhone} required type="tel" placeholder="055 555 5555" style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Pickup Address</label>
                                <textarea name="pickupAddress" defaultValue={defaultSenderAddress} required placeholder="House No, Street Name, City" rows={3} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)' }} />
                            </div>
                        </div>
                    </div>

                    {/* RECEIVER */}
                    <div>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--accent)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>Delivery (To)</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Receiver Name</label>
                                <input name="receiverName" defaultValue={defaultReceiverName} required type="text" placeholder="Receiver Name" style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Receiver Phone</label>
                                <input name="receiverPhone" defaultValue={defaultReceiverPhone} required type="tel" placeholder="024 444 4444" style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Delivery Address</label>
                                <textarea name="receiverAddress" defaultValue={defaultReceiverAddress} required placeholder="House No, Landmark, City" rows={3} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)' }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* PACKAGE INFO */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>Package & Service Details</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Item Description</label>
                            <input name="itemDescription" defaultValue={defaultItemDesc} required type="text" placeholder="e.g. Box of clothes, Documents, Laptop" style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Package Size</label>
                            <select
                                name="weightCategory"
                                value={formDataState.weightCategory}
                                onChange={e => setFormDataState({ ...formDataState, weightCategory: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)' }}
                            >
                                <option value="small">Small (Less than 2kg)</option>
                                <option value="medium">Medium (2kg - 10kg)</option>
                                <option value="large">Large (Over 10kg)</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Service Type</label>
                            <select
                                name="serviceType"
                                value={formDataState.serviceType}
                                onChange={e => setFormDataState({ ...formDataState, serviceType: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)' }}
                            >
                                <option value="standard">Standard Delivery (24-48hrs)</option>
                                <option value="express">Express Delivery (Same Day)</option>
                                <option value="overnight">Overnight Shipping</option>
                            </select>
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Who pays for delivery?</label>
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input type="radio" name="payer" value="sender" defaultChecked />
                                    <span>Sender (Me)</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input type="radio" name="payer" value="receiver" />
                                    <span>Receiver (pay on delivery)</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* QUOTE & ACTION */}
                <div style={{
                    padding: '1.5rem',
                    background: 'var(--surface-hover)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Estimated Total</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>GH₵ {estimatedCost.toFixed(2)}</div>
                    </div>

                    <button disabled={isLoading} type="submit" className="btn btn-primary" style={{ padding: '14px 40px', fontSize: '1.1rem' }}>
                        {isLoading ? 'Processing...' : 'Book Shipment'}
                    </button>
                </div>
            </form>
        </div>
    );
}
