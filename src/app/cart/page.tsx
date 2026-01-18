'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from './cart.module.css';

const PaystackButton = dynamic(() => import('react-paystack').then((mod) => mod.PaystackButton), {
    ssr: false,
});

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, total } = useCart();
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

    // Basic Paystack Config (For Test Mode)
    // In a real scenario with Subaccounts, we would split the payment.
    // Since we can't easily do split payments on client-side only without exposing sensitive rules,
    // we will simulate a single charge here. 
    // You would typically call your backend to initialize the transaction with 'split' parameters.

    const componentProps = {
        email: 'farmer@agifarmz.com', // In a real app, get this from user profile/input
        amount: total * 100, // Paystack expects amount in kobo
        publicKey,
        text: "Pay Now",
        onSuccess: (reference: any) => {
            alert("Payment successful! Reference: " + reference.reference);
            // clearCart(); -> Should clear cart here
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
                    {cart.map((item) => (
                        <div key={item.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                            <div style={{ flex: 1 }}>
                                <h3>{item.name}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sold by: {item.seller}</p>
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
                                ₦{(item.price * item.quantity).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.cartSummary}>
                    <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
                        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Order Summary</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span>Subtotal</span>
                            <span>₦{total.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <span>Total</span>
                            <span style={{ color: 'var(--primary)' }}>₦{total.toLocaleString()}</span>
                        </div>

                        <div style={{ width: '100%' }}>
                            <PaystackButton className="btn btn-primary" {...componentProps} />
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
