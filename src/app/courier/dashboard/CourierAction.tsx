'use client';

import { useState } from 'react';
import { updateCourierDeliveryStatus, completeDelivery } from '@/app/actions/delivery-actions';

export default function CourierAction({ itemId, currentStatus }: { itemId: string, currentStatus: string }) {
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);

    const handleUpdate = async (status: string) => {
        if (!confirm(`Update status to ${status}?`)) return;
        setLoading(true);
        try {
            const res = await updateCourierDeliveryStatus(itemId, status);
            if (res.error) alert(res.error);
        } catch (e) {
            alert('Failed to update');
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async () => {
        if (!otp || otp.length < 4) {
            alert("Please enter a valid OTP from the buyer");
            return;
        }
        setLoading(true);
        try {
            const res = await completeDelivery(itemId, otp);
            if (res.error) {
                alert(res.error);
            } else {
                alert("Delivery Verified & Completed! 🎉");
                setShowOtpInput(false);
            }
        } catch (e) {
            alert('Verification failed');
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <span style={{ fontSize: '0.8rem' }}>Processing...</span>;

    if (currentStatus === 'pending_pickup') {
        return <span style={{ fontSize: '0.8rem', color: '#f39c12' }}>Waiting for Pickup</span>;
    }

    // If shop marked it ready
    if (currentStatus === 'ready_for_pickup' || currentStatus === 'pending_pickup') { // Allowing pick up from pending too if needed for simplicity
        return (
            <button
                onClick={() => handleUpdate('out_for_delivery')}
                className="btn btn-primary"
                style={{ fontSize: '0.7rem', padding: '4px 8px' }}
            >
                Pick Up & Start Delivery
            </button>
        );
    }

    if (currentStatus === 'out_for_delivery') {
        if (showOtpInput) {
            return (
                <div style={{ display: 'flex', gap: '4px' }}>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        style={{ width: '80px', padding: '4px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', color: 'black' }}
                    />
                    <button
                        onClick={handleComplete}
                        className="btn btn-primary"
                        style={{ fontSize: '0.7rem', padding: '4px 8px', background: '#2ecc71', borderColor: '#27ae60' }}
                    >
                        Verify
                    </button>
                    <button onClick={() => setShowOtpInput(false)} style={{ color: 'red', fontSize: '10px' }}>X</button>
                </div>
            )
        }
        return (
            <button
                onClick={() => setShowOtpInput(true)}
                className="btn btn-primary"
                style={{ fontSize: '0.7rem', padding: '4px 8px', background: '#2ecc71', borderColor: '#27ae60' }}
            >
                Arrived & Verify OTP
            </button>
        );
    }

    if (currentStatus === 'delivered_success' || currentStatus === 'delivered') {
        return <span style={{ fontSize: '0.8rem', color: '#2ecc71' }}>Completed ✅</span>;
    }

    return <span style={{ fontSize: '0.8rem' }}>{currentStatus}</span>;
}
