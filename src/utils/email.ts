
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail', // Easy to allow flexible service via env, but gmail is standard for free tiers
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password if using Gmail
    },
});

export async function sendEmail(to: string, subject: string, html: string) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Email credentials not set. Skipping email.');
        return;
    }

    try {
        await transporter.sendMail({
            from: `"OrivoMart" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export async function sendSellerOrderNotification(
    sellerEmail: string,
    sellerName: string,
    orderId: string,
    items: any[]
) {
    const itemsHtml = items.map(item => `
        <li>
            <strong>${item.name}</strong> x ${item.quantity} - GHS ${item.price}
        </li>
    `).join('');

    const html = `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>New Order Received!</h2>
            <p>Hello ${sellerName},</p>
            <p>You have received a new order on OrivoMart.</p>
            <p><strong>Order ID:</strong> ${orderId}</p>
            
            <h3>Items:</h3>
            <ul>
                ${itemsHtml}
            </ul>
            
            <p>Please login to your dashboard to process this order.</p>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/orders" style="background: #e67e22; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Order</a>
        </div>
    `;

    await sendEmail(sellerEmail, 'New Sale Notification - OrivoMart', html);
}

export async function sendBuyerOrderConfirmation(
    buyerEmail: string,
    buyerName: string,
    orderId: string,
    items: any[],
    total: number
) {
    const itemsHtml = items.map(item => `
        <li style="margin-bottom: 10px;">
            <div style="font-weight: bold;">${item.name}</div>
            <div style="font-size: 0.9em; color: #555;">Quantity: ${item.quantity} | Price: GHS ${item.price}</div>
        </li>
    `).join('');

    const html = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">Order Confirmed!</h1>
            </div>
            
            <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
                <p>Hi ${buyerName},</p>
                <p>Thank you for shopping with OrivoMart! Your order has been successfully placed and is being processed.</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 0;"><strong>Order ID:</strong> ${orderId}</p>
                    <p style="margin: 5px 0 0;"><strong>Total Amount:</strong> GHS ${total.toFixed(2)}</p>
                </div>

                <h3>Order Summary:</h3>
                <ul style="list-style-type: none; padding: 0;">
                    ${itemsHtml}
                </ul>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                
                <p style="font-size: 0.9em; color: #777;">
                    You can track your order status in your dashboard.
                </p>
                
                <div style="text-align: center; margin-top: 30px;">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/orders" 
                       style="background-color: #e67e22; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        View My Order
                    </a>
                </div>
            </div>
            
            <div style="text-align: center; font-size: 0.8em; color: #999; margin-top: 20px;">
                <p>&copy; ${new Date().getFullYear()} OrivoMart. All rights reserved.</p>
            </div>
        </div>
    `;

    await sendEmail(buyerEmail, 'Order Confirmation - OrivoMart', html);
}
