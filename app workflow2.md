Orivo Mart – Payment Workflow (Full Online + Controlled COD)
Overview
Orivo Mart supports two payment methods: Full Online Payment and Controlled Cash on Delivery (COD). This hybrid workflow ensures flexibility for buyers while maintaining platform trust, logistics protection, and fraud control.
1. Buyer Checkout – Payment Selection
Step 1: Buyer adds items to cart and proceeds to checkout.
Step 2: Buyer selects payment option:
- Full Online Payment
- Controlled Cash on Delivery (COD)
System validates eligibility and displays instructions accordingly.
2. Full Online Payment Flow
Step 3: Buyer selects 'Pay Full Online'.
Step 4: Buyer pays full amount via Paystack (Card/MoMo).
Order status: FULLY_PAID.
Step 5: Seller notified to prepare item.
Step 6: Rider assigned for pickup and delivery.
Step 7: Rider delivers item and buyer confirms OTP.
Order status: DELIVERED_SUCCESS.
Step 8: Seller payout unlocked after delivery confirmation.
3. Controlled COD Flow
Step 3: Buyer selects 'Cash on Delivery'.
Step 4: System checks buyer trust score, item value, and delivery zone.
Step 5: Buyer pays commitment fee via Paystack.
Order status: COD_COMMITMENT_PAID.
Step 6: Buyer receives OTP to confirm delivery commitment.
If confirmed → ORDER_CONFIRMED.
If ignored → AUTO_CANCEL and commitment fee forfeited.
4. Seller & Logistics Flow (Applies to Both Methods)
Step 7: Seller prepares item after confirmation.
Step 8: Rider assigned and confirms pickup with photo proof.
Order status: IN_TRANSIT.
5. Delivery Flow
For Full Online Payment:
- Buyer confirms receipt with OTP.

For COD:
- Buyer inspects item
- Pays remaining cash
- Provides OTP confirmation

Order status: DELIVERED_SUCCESS.
6. Failed Delivery Handling (COD Only)
If buyer refuses delivery:
Rider logs failure reason.
Order status: FAILED_DELIVERY.
Commitment fee retained.
Buyer trust score reduced.
7. Post-Delivery Dispute Flow
Buyer has 24–48 hours to report issues.
Buyer uploads photos and complaint.
Admin reviews seller, rider proof, and buyer claim.
Decision: refund / partial refund / rejection.
Trust scores updated.
System Safeguards
- Trust scoring engine
- OTP confirmations
- Rider photo proof
- Failed delivery penalties
- Fraud detection flags
- Admin dispute dashboard
Outcome
This dual-payment workflow gives buyers flexibility while protecting Orivo Mart from logistics losses, fraud, and unserious orders. It enables scalable growth built on trust infrastructure.
