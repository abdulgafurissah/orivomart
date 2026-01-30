'use client';

import { useState } from 'react';
import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { registerSeller } from '@/app/actions/seller-signup';

import styles from './signup.module.css';

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
        <div className={`container ${styles.container}`}>
            <div className={`glass-panel ${styles.formPanel}`}>
                <h2 className={styles.title}>Become a Seller</h2>
                <div className={styles.subtitle}>Join OrivoMart today.</div>

                <form onSubmit={handleSubmit} className={styles.formGrid}>

                    {/* Basic Info */}
                    <div className={styles.fullWidth}>
                        <h3 className={styles.sectionTitle}>Shop Details</h3>
                    </div>

                    <div>
                        <label className={styles.label}>Shop Name</label>
                        <input required type="text" placeholder="e.g. Tech World" value={formData.shopName} onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                            className={styles.input} />
                    </div>
                    <div>
                        <label className={styles.label}>Owner Full Name</label>
                        <input required type="text" placeholder="Your Full Name" value={formData.ownerName} onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                            className={styles.input} />
                    </div>
                    <div>
                        <label className={styles.label}>Email Address</label>
                        <input required type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={styles.input} />
                    </div>
                    <div>
                        <label className={styles.label}>Password</label>
                        <input required type="password" placeholder="Create a password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className={styles.input} />
                    </div>
                    <div>
                        <label className={styles.label}>Phone Number</label>
                        <input required type="text" placeholder="024XXXXXXX" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className={styles.input} />
                    </div>

                    <div className={styles.fullWidth}>
                        <label className={styles.label}>Shop Logo / Cover Image</label>
                        <input type="file" accept="image/*" onChange={(e) => setShopImageFile(e.target.files ? e.target.files[0] : null)}
                            className={styles.input} style={{ padding: '8px' }} />
                        <p className={styles.helperText}>This image will be displayed on the public shops page.</p>
                    </div>

                    {/* KYC Info */}
                    <div className={styles.fullWidth} style={{ marginTop: '1rem' }}>
                        <h3 className={styles.sectionTitle}>Security & KYC</h3>
                    </div>

                    <div>
                        <label className={styles.label}>Home Address</label>
                        <input required type="text" placeholder="House No, Street Name" value={formData.homeAddress} onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })}
                            className={styles.input} />
                    </div>
                    <div>
                        <label className={styles.label}>Business Address</label>
                        <input required type="text" placeholder="Office Location" value={formData.businessAddress} onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                            className={styles.input} />
                    </div>
                    <div>
                        <label className={styles.label}>Business Registration Number</label>
                        <input required type="text" placeholder="e.g. BN12345678" value={formData.businessRegNum} onChange={(e) => setFormData({ ...formData, businessRegNum: e.target.value })}
                            className={styles.input} />
                    </div>
                    <div>
                        <label className={styles.label}>Ghana Card Number</label>
                        <input required type="text" placeholder="GHA-XXXXXXXXX-X" value={formData.ghanaCardNum} onChange={(e) => setFormData({ ...formData, ghanaCardNum: e.target.value })}
                            className={styles.input} />
                    </div>
                    <div className={styles.fullWidth}>
                        <label className={styles.label}>GPS Address</label>
                        <input required type="text" placeholder="GA-123-4567" value={formData.gpsAddress} onChange={(e) => setFormData({ ...formData, gpsAddress: e.target.value })}
                            className={styles.input} />
                    </div>

                    <div className={styles.fullWidth}>
                        <label className={styles.label}>Business Certificate / ID (Image/PDF)</label>
                        <input type="file" accept="image/*,.pdf" onChange={(e) => setKycFile(e.target.files ? e.target.files[0] : null)}
                            className={styles.input} style={{ padding: '8px' }} />
                        <p className={styles.helperText}>Upload your Business Registration Certificate or Ghana Card image.</p>
                    </div>

                    {/* Payment Info */}
                    <div className={styles.fullWidth} style={{ marginTop: '1rem' }}>
                        <h3 className={styles.sectionTitle}>Payout Account</h3>
                    </div>

                    <div className={styles.fullWidth}>
                        <div className={styles.paymentGrid}>
                            <select required value={formData.momoNetwork} onChange={(e) => setFormData({ ...formData, momoNetwork: e.target.value })}
                                className={styles.input}>
                                <option value="MTN">MTN Mobile Money</option>
                                <option value="VOD">Telecel Cash</option>
                                <option value="ATL">AirtelTigo Money</option>
                            </select>
                            <input required type="text" placeholder="Momo Number (024...)" value={formData.momoNumber} onChange={(e) => setFormData({ ...formData, momoNumber: e.target.value })}
                                className={styles.input} />
                        </div>
                        <p className={styles.helperText}>* OrivoMart fee: 3% per transaction.</p>
                    </div>

                    <div className={styles.fullWidth} style={{ paddingTop: '1rem' }}>
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
