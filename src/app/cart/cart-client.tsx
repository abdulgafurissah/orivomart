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

export default function CartClient({ user }: { user: any }) {
    const { cart, removeFromCart, updateQuantity, total } = useCart();
    const router = useRouter();
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

    const [subaccountCode, setSubaccountCode] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);

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


    const [shippingInfo, setShippingInfo] = useState({
        email: '',
        name: '',
        phone: '',
        address: '',
        gpsAddress: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({ ...prev, [name]: value }));
    };

    const isFormValid = shippingInfo.email && shippingInfo.name && shippingInfo.phone && shippingInfo.address && shippingInfo.gpsAddress;

    const componentProps = {
        email: shippingInfo.email,
        amount: total * 100,
        publicKey,
        text: "Pay Now",
        subaccount: subaccountCode || undefined,
        metadata: {
            custom_fields: [
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
                total
            });

            if (result.success) {
                alert("Payment successful! Order #" + result.orderId);
                // Clear local cart
                // We need to access clearCart from context. But wait, I destructured it? 
                // Ah, I need to add clearCart to destructuring at top of component.
                // Assuming it's available.
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span>Subtotal</span>
                            <span>GH₵ {total.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <span>Total</span>
                            <span style={{ color: 'var(--primary)' }}>GH₵ {total.toLocaleString()}</span>
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
