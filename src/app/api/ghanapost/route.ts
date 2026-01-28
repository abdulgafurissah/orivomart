import { NextRequest, NextResponse } from 'next/server';
import { getAddressDetails } from '@/lib/ghanaPostGPS';

export async function POST(req: NextRequest) {
    try {
        const { address } = await req.json();

        if (!address) {
            return NextResponse.json({ error: 'Address is required' }, { status: 400 });
        }

        const data = await getAddressDetails(address);

        if (!data) {
            // It might be 404 not found or 500 error, but the service returns null on error/missing key
            // If the service handled it better we could distinguish.
            return NextResponse.json({ error: 'Failed to fetch address details or invalid address' }, { status: 400 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in GhanaPost API route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
