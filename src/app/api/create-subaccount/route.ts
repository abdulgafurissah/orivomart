import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { business_name, settlement_bank, account_number, email, primary_contact_name } = body;

        // OrivoMart takes 3% of the transaction
        // limit is set to 0 or null usually, meaning no cap? Or we just set percentage.
        const percentage_charge = 3; // 3%

        // Validate inputs
        if (!business_name || !settlement_bank || !account_number) {
            return NextResponse.json(
                { error: 'Missing required fields: business_name, settlement_bank, account_number' },
                { status: 400 }
            );
        }

        const paystackSecret = process.env.PAYSTACK_SECRET_KEY;

        if (!paystackSecret) {
            console.error('PAYSTACK_SECRET_KEY is not defined');
            return NextResponse.json(
                { error: 'Server misconfiguration: Payment key missing' },
                { status: 500 }
            );
        }

        // Call Paystack API to create subaccount
        // Docs: https://paystack.com/docs/api/subaccount/#create
        const response = await fetch('https://api.paystack.co/subaccount', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${paystackSecret}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                business_name,
                settlement_bank, // Expecting Codes: 'MTN', 'VOD', 'ATL' for Ghana Momo
                account_number,
                percentage_charge,
                primary_contact_email: email,
                primary_contact_name: primary_contact_name,
                description: `Seller Account for ${business_name} on OrivoMart`
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Paystack API Error:', data);
            return NextResponse.json(
                { error: data.message || 'Failed to create subaccount with Paystack' },
                { status: response.status }
            );
        }

        // Return the essential data for the frontend to save to Supabase
        return NextResponse.json({
            success: true,
            subaccount_code: data.data.subaccount_code,
            id: data.data.id,
            active: data.data.active,
            message: 'Subaccount created successfully'
        });

    } catch (error) {
        console.error('Create Subaccount Handler Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
