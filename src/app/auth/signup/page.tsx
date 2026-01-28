'use client';

import { useState } from 'react';
import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { registerSeller } from '@/app/actions/seller-signup';

export default function SellerSignup() {
    const [formData, setFormData] = useState({
        details: '',
        shopName: '',
        ownerName: '',
        email: '',
        password: '',
        phone: '',
        momoNumber: '',
        momoNetwork: 'MTN',
        homeAddress: '',
        businessAddress: '',
        businessRegNum: '',
        ghanaCardNum: '',
        gpsAddress: ''
    });
    const [kycFile, setKycFile] = useState<File | null>(null);
    const [shopImageFile, setShopImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter(); // Helper import needed at top


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formDataToSend = new FormData();
        // Append all fields
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });
        if (kycFile) {
            formDataToSend.append('kycFile', kycFile);
        }
        if (shopImageFile) {
            formDataToSend.append('shopImageFile', shopImageFile);
        }

        const result = await registerSeller(formDataToSend);

        if (result.error) {
            alert(result.error);
            setIsLoading(false);
        } else {
            alert('Application Submitted! Redirecting...');
            window.location.href = '/dashboard';
        }
    };

    return (
        <div className="container" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '2.5rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>Become a Seller</h2>
                Join OrivoMart today.

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

                    {/* Basic Info */}
                    <div style={{ gridColumn: '1 / -1' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Shop Details</h3>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Shop Name</label>
                        <input required type="text" placeholder="e.g. Tech World" value={formData.shopName} onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Owner Full Name</label>
                        <input required type="text" placeholder="Your Full Name" value={formData.ownerName} onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
                        <input required type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
                        <input required type="password" placeholder="Create a password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Phone Number</label>
                        <input required type="text" placeholder="024XXXXXXX" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Shop Logo / Cover Image</label>
                        <input type="file" accept="image/*" onChange={(e) => setShopImageFile(e.target.files ? e.target.files[0] : null)}
                            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>This image will be displayed on the public shops page.</p>
                    </div>

                    {/* KYC Info */}
                    <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Security & KYC</h3>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Home Address</label>
                        <input required type="text" placeholder="House No, Street Name" value={formData.homeAddress} onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Business Address</label>
                        <input required type="text" placeholder="Office Location" value={formData.businessAddress} onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Business Registration Number</label>
                        <input required type="text" placeholder="e.g. BN12345678" value={formData.businessRegNum} onChange={(e) => setFormData({ ...formData, businessRegNum: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Ghana Card Number</label>
                        <input required type="text" placeholder="GHA-XXXXXXXXX-X" value={formData.ghanaCardNum} onChange={(e) => setFormData({ ...formData, ghanaCardNum: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>GPS Address</label>
                        <input required type="text" placeholder="GA-123-4567" value={formData.gpsAddress} onChange={(e) => setFormData({ ...formData, gpsAddress: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Business Certificate / ID (Image/PDF)</label>
                        <input type="file" accept="image/*,.pdf" onChange={(e) => setKycFile(e.target.files ? e.target.files[0] : null)}
                            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Upload your Business Registration Certificate or Ghana Card image.</p>
                    </div>

                    {/* Payment Info */}
                    <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Payout Account</h3>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                            <select required value={formData.momoNetwork} onChange={(e) => setFormData({ ...formData, momoNetwork: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }}>
                                <option value="MTN" style={{ color: 'black' }}>MTN Mobile Money</option>
                                <option value="VOD" style={{ color: 'black' }}>Telecel Cash</option>
                                <option value="ATL" style={{ color: 'black' }}>AirtelTigo Money</option>
                            </select>
                            <input required type="text" placeholder="Momo Number (024...)" value={formData.momoNumber} onChange={(e) => setFormData({ ...formData, momoNumber: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white' }} />
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>* OrivoMart fee: 3% per transaction.</p>
                    </div>

                    <div style={{ gridColumn: '1 / -1', paddingTop: '1rem' }}>
                        <button disabled={isLoading} type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1.1rem', opacity: isLoading ? 0.7 : 1 }}>
                            {isLoading ? 'Verifying...' : 'Submit Business Application'}
                        </button>
                    </div>
                </form>

                <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Already have a shop? <Link href="/auth/signin" style={{ color: 'var(--primary)' }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
}
