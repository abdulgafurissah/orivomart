'use client';

import { useState } from 'react';
import { createDispute } from '@/app/actions/dispute-actions';

interface ReportDisputeModalProps {
    orderId: string;
    existingDispute?: any;
}

export default function ReportDisputeModal({ orderId, existingDispute }: ReportDisputeModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState('Not Received');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await createDispute({ orderId, reason, description });
        setLoading(false);

        if (result.success) {
            alert('Dispute submitted successfully. Our team will review it.');
            setIsOpen(false);
        } else {
            alert(result.message);
        }
    };

    if (existingDispute) {
        return (
            <span style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: 'rgba(255, 165, 0, 0.15)',
                color: 'orange',
                fontSize: '0.85rem',
                border: '1px solid rgba(255, 165, 0, 0.3)'
            }}>
                ⚠️ Dispute {existingDispute.status}
            </span>
        );
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="btn"
                style={{
                    background: 'rgba(220, 53, 69, 0.1)',
                    color: '#dc3545',
                    border: '1px solid rgba(220, 53, 69, 0.2)',
                    fontSize: '0.85rem',
                    padding: '6px 12px'
                }}
            >
                Report Problem
            </button>

            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }} onClick={() => setIsOpen(false)}>
                    <div
                        className="glass-panel"
                        style={{ width: '90%', maxWidth: '500px', padding: '2rem', background: '#1a1a1a' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 style={{ marginBottom: '1.5rem' }}>Report a Problem</h2>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Reason</label>
                                <select
                                    className="input"
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                    style={{ width: '100%', padding: '10px', background: '#333', color: 'white', border: '1px solid #555' }}
                                >
                                    <option value="Not Received">Order not received</option>
                                    <option value="Damaged">Item damaged</option>
                                    <option value="Wrong Item">Wrong item received</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                                <textarea
                                    className="input"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Please describe the issue..."
                                    required
                                    rows={4}
                                    style={{ width: '100%', padding: '10px', background: '#333', color: 'white', border: '1px solid #555', resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Submitting...' : 'Submit Dispute'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
