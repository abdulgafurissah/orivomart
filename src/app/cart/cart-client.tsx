'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import styles from './cart.module.css';
import { shops } from '@/data/mockData';
import { useRouter } from 'next/navigation';
import { verifyGpsAddress } from '@/app/actions/gps-actions';

const PaystackButton = dynamic(() => import('react-paystack').then((mod) => mod.PaystackButton), {
    ssr: false,
});

// ... (imports)

export default function CartClient({ user, userProfile }: { user: any, userProfile?: any }) { // Added userProfile prop
    const { cart, removeFromCart, updateQuantity, total } = useCart();

    // Check Trust Score
    const trustScore = userProfile?.trustScore ?? 100; // Default to 100 if new/guest (or handle guest differnetly)
    const isCodEligible = trustScore >= 50;
    const router = useRouter();
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

    const [subaccountCode, setSubaccountCode] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);

    // Shipping State
    const [shippingInfo, setShippingInfo] = useState({
        email: '',
        name: '',
        phone: '',
        address: '',
        gpsAddress: ''
    });

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD'>('ONLINE');
    const COMMITMENT_FEE_PERCENTAGE = 0.15; // 15% commitment fee

    const commitmentFee = Math.ceil(total * COMMITMENT_FEE_PERCENTAGE);
    const amountToPay = paymentMethod === 'ONLINE' ? total : commitmentFee;
    const balanceToPay = paymentMethod === 'ONLINE' ? 0 : total - commitmentFee;

    const handleVerifyGps = async () => {
        if (!shippingInfo.gpsAddress) {
            alert("Please enter a GPS address first");
            return;
        }
        setIsVerifying(true);
        try {
            const result = await verifyGpsAddress(shippingInfo.gpsAddress);
            if (result.success && result.formattedAddress) {
                setShippingInfo(prev => ({
                    ...prev,
                    address: result.formattedAddress || prev.address
                }));
                alert(`Address Found: ${result.formattedAddress}`);
            } else {
                alert(result.message || "Address not found");
            }
        } catch (error) {
            alert("Error verifying address");
        } finally {
            setIsVerifying(false);
        }
    };

    useEffect(() => {
        const checkSubaccount = async () => {
            const shopIds = Array.from(new Set(cart.map(item => item.shopId)));

            if (shopIds.length === 1) {
                const shopId = shopIds[0];
                const shop = shops.find(s => s.id === shopId);

                if (shop) {
                    try {
                        const res = await fetch(`/api/get-subaccount?seller=${encodeURIComponent(shop.name)}`);
                        const data = await res.json();
                        if (data.subaccount_code) {
                            setSubaccountCode(data.subaccount_code);
                        } else {
                            setSubaccountCode(null);
                        }
                    } catch (err) {
                        setSubaccountCode(null);
                    }
                }
            } else {
                setSubaccountCode(null);
            }
        };

        if (cart.length > 0) {
            checkSubaccount();
        }
    }, [cart]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({ ...prev, [name]: value }));
    };

    const isFormValid = shippingInfo.email && shippingInfo.name && shippingInfo.phone && shippingInfo.address && shippingInfo.gpsAddress;

    const componentProps = {
        email: shippingInfo.email,
        amount: amountToPay * 100,
        publicKey,
        text: paymentMethod === 'ONLINE' ? `Pay Full Amount (GH₵ ${amountToPay.toLocaleString()})` : `Pay Commitment Fee (GH₵ ${amountToPay.toLocaleString()})`,
        subaccount: subaccountCode || undefined,
        metadata: {
            custom_fields: [
                { display_name: "Payment Method", variable_name: "payment_method", value: paymentMethod },
                { display_name: "Customer Name", variable_name: "customer_name", value: shippingInfo.name },
                { display_name: "Phone", variable_name: "phone", value: shippingInfo.phone },
                { display_name: "Address", variable_name: "address", value: shippingInfo.address },
                { display_name: "GPS Address", variable_name: "gps_address", value: shippingInfo.gpsAddress },
            ]
        },
        onSuccess: async (reference: any) => {
            // Save Order to DB
            const { createOrder } = await import('@/app/actions/checkout-actions');
            const result = await createOrder({
                cart,
                shippingInfo,
                paymentReference: reference.reference,
                total,
                paymentMethod,
                commitmentFeePaid: paymentMethod === 'COD' ? commitmentFee : undefined
            });

            if (result.success) {
                alert(paymentMethod === 'ONLINE'
                    ? "Payment successful! Order #" + result.orderId
                    : "Commitment Fee Paid! Order #" + result.orderId + ". Please pay balance on delivery.");
                window.location.href = '/orders'; // Redirect to orders page
            } else {
                alert("Payment successful but failed to save order: " + result.error);
            }
        },
        onClose: () => alert("Payment cancelled"),
    };

    if (cart.length === 0) {
        return (
            <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
                <h2>Your cart is empty</h2>
                <Link href="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    Go Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Shopping Cart</h1>

            <div className={styles.cartGrid}>
                <div className={styles.cartItems}>
                    {cart.map((item) => {
                        // Use stored shop name or fallback
                        const shopName = (item as any).shopName || (item as any).sellerName || 'Unknown Shop';
                        return (
                            <div key={item.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                                <div style={{ flex: 1 }}>
                                    <h3>{item.name}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sold by: {shopName}</p>
                                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="btn btn-secondary"
                                                style={{ padding: '4px 8px' }}
                                            >-</button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="btn btn-secondary"
                                                style={{ padding: '4px 8px' }}
                                            >+</button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    GH₵ {(item.price * item.quantity).toLocaleString()}
                                </div>
                            </div>
                        );
                    })}

                    <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Shipping Details</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Full Name</label>
                                <input type="text" name="name" placeholder="John Doe" value={shippingInfo.name} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
                                <input type="email" name="email" placeholder="john@example.com" value={shippingInfo.email} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Phone Number</label>
                                <input type="tel" name="phone" placeholder="024XXXXXXX" value={shippingInfo.phone} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Delivery Address</label>
                                <input type="text" name="address" placeholder="House No, Street Name, City" value={shippingInfo.address} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Ghana Post GPS Address</label>
                                <input type="text" name="gpsAddress" placeholder="GA-123-4567" value={shippingInfo.gpsAddress} onChange={handleInputChange} style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-primary)' }} />
                                <button
                                    onClick={handleVerifyGps}
                                    type="button"
                                    disabled={isVerifying || !shippingInfo.gpsAddress}
                                    className="btn btn-secondary"
                                    style={{ marginTop: '0.5rem', width: '100%', padding: '8px', fontSize: '0.9rem' }}
                                >
                                    {isVerifying ? 'Verifying...' : 'Verify Address'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.cartSummary}>
                    <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
                        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Order Summary</h3>

                        {/* Payment Method Selector */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Payment Method</label>
                            <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                                <label style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '10px', borderRadius: '8px',
                                    border: paymentMethod === 'ONLINE' ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                                    background: paymentMethod === 'ONLINE' ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                                    cursor: 'pointer'
                                }}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="ONLINE"
                                        checked={paymentMethod === 'ONLINE'}
                                        onChange={() => setPaymentMethod('ONLINE')}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>Pay Full Online</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fastest processing. 100% Secure.</div>
                                    </div>
                                </label>

                                <label style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '10px', borderRadius: '8px',
                                    border: paymentMethod === 'COD' ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
                                    background: paymentMethod === 'COD' ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                                    cursor: isCodEligible ? 'pointer' : 'not-allowed',
                                    opacity: isCodEligible ? 1 : 0.6
                                }}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={() => isCodEligible && setPaymentMethod('COD')}
                                        disabled={!isCodEligible}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>Controlled Cash on Delivery</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pay {COMMITMENT_FEE_PERCENTAGE * 100}% now, verify item, pay rest on delivery.</div>
                                        {!isCodEligible && (
                                            <div style={{ color: '#e74c3c', fontSize: '0.75rem', marginTop: '4px' }}>
                                                Unavailable: Low Trust Score ({trustScore}). Complete more online orders to unlock.
                                            </div>
                                        )}
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Subtotal</span>
                            <span>GH₵ {total.toLocaleString()}</span>
                        </div>

                        {paymentMethod === 'COD' && (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#f39c12' }}>
                                    <span>Commitment Fee (15%)</span>
                                    <span>GH₵ {commitmentFee.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#2ecc71' }}>
                                    <span>Pay on Delivery</span>
                                    <span>GH₵ {balanceToPay.toLocaleString()}</span>
                                </div>
                            </>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontWeight: 'bold', fontSize: '1.2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                            <span>Total to Pay Now</span>
                            <span style={{ color: 'var(--primary)' }}>GH₵ {amountToPay.toLocaleString()}</span>
                        </div>

                        <div style={{ width: '100%' }}>
                            {!user ? (
                                <button
                                    onClick={() => router.push('/auth/signin?redirect=/cart')}
                                    className="btn btn-primary"
                                    style={{ width: '100%', background: '#f39c12' }}
                                >
                                    Login to Pay
                                </button>
                            ) : isFormValid ? (
                                <PaystackButton
                                    className="btn btn-primary"
                                    {...componentProps}
                                    currency="GHS"
                                />
                            ) : (
                                <button className="btn btn-secondary" disabled style={{ width: '100%', cursor: 'not-allowed', opacity: 0.6 }}>
                                    Enter Shipping Details
                                </button>
                            )}
                        </div>

                        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                            Secure Payment via Paystack
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
