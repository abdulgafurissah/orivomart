import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sellerName = searchParams.get('seller');

    if (!sellerName) {
        return NextResponse.json({ error: 'Seller name is required' }, { status: 400 });
    }

    try {
        const seller = await prisma.seller.findFirst({
            where: { shopName: sellerName },
            select: { paystackSubaccountCode: true }
        });

        if (!seller) {
            return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
        }

        return NextResponse.json({
            subaccount_code: seller.paystackSubaccountCode
        });

    } catch (error) {
        console.error('Fetch error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
