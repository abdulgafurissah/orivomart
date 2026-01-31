'use server';

import { prisma } from '@/utils/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/utils/session';

import { uploadToStorage } from '@/utils/storage';


export async function registerSeller(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Shop Details
    const shopName = formData.get('shopName') as string;
    const ownerName = formData.get('ownerName') as string;
    const phone = formData.get('phone') as string;

    // KYC
    const businessAddress = formData.get('businessAddress') as string;
    const businessRegNum = formData.get('businessRegNum') as string;
    const ghanaCardNum = formData.get('ghanaCardNum') as string;
    const gpsAddress = formData.get('gpsAddress') as string;

    // Payment
    const momoNetwork = formData.get('momoNetwork') as string;
    const momoNumber = formData.get('momoNumber') as string;

    if (!email || !password || !shopName || !ownerName) {
        return { error: 'Missing required fields.' };
    }

    try {
        // 1. Check if user exists
        const existing = await prisma.profile.findUnique({ where: { email } });
        if (existing) {
            return { error: 'Email already registered.' };
        }

        // 2. Create Paystack Subaccount
        let subaccountCode = 'SUB_PENDING';
        try {
            const paystackRes = await fetch('https://api.paystack.co/subaccount', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    business_name: shopName,
                    primary_contact_name: ownerName,
                    email: email,
                    settlement_bank: momoNetwork,
                    account_number: momoNumber,
                    percentage_charge: 3
                })
            });
            const paystackData = await paystackRes.json();
            if (paystackData.status) {
                subaccountCode = paystackData.data.subaccount_code;
            }
        } catch (e) {
            console.error('Paystack Network Error', e);
        }

        // 3. Create User in Prisma
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.profile.create({
            data: {
                email,
                password: hashedPassword,
                fullName: ownerName,
                role: 'seller'
            }
        });

        // 4. Upload Files
        const kycFile = formData.get('kycFile') as File;
        const shopImageFile = formData.get('shopImageFile') as File;

        let kycDocUrl = null;
        let shopImageUrl = null;

        if (kycFile && kycFile.size > 0) {
            kycDocUrl = await uploadToStorage(kycFile, 'kyc', `kyc_${newUser.id}_${Date.now()}`);
        }
        if (shopImageFile && shopImageFile.size > 0) {
            shopImageUrl = await uploadToStorage(shopImageFile, 'shop-images', `shop_${newUser.id}_${Date.now()}`);
        }

        // 5. Create Seller Record
        await prisma.seller.create({
            data: {
                userId: newUser.id,
                shopName,
                ownerName,
                email,
                phone,
                paystackSubaccountCode: subaccountCode,
                status: 'pending',
                rating: 0,
                businessAddress,
                businessRegNum,
                ghanaCardNum,
                gpsAddress,
                kycDocUrl: kycDocUrl || undefined,
                image: shopImageUrl || undefined
            }
        });

        // 5. Login Session
        await createSession(newUser.id, newUser.role, newUser.email);

        return { success: true };

    } catch (error: any) {
        console.error('Seller Registration Error:', error);
        return { error: error.message || 'Registration failed.' };
    }
}
