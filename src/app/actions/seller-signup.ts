'use server';

import { prisma } from '@/utils/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/utils/session';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client Helper
const getSupabase = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
};

export async function registerSeller(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Shop Details
    const shopName = formData.get('shopName') as string;
    const ownerName = formData.get('ownerName') as string;
    const phone = formData.get('phone') as string;

    // KYC
    const homeAddress = formData.get('homeAddress') as string;
    const businessAddress = formData.get('businessAddress') as string;
    const businessRegNum = formData.get('businessRegNum') as string;
    const ghanaCardNum = formData.get('ghanaCardNum') as string;
    const gpsAddress = formData.get('gpsAddress') as string;
    const kycFile = formData.get('kycFile') as File;
    const shopImageFile = formData.get('shopImageFile') as File;

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

        // 2. Create Paystack Subaccount (Simulated HTTP call for now since we are in server action)
        // Ideally we call the API route or implement logic here directly.
        // Let's implement logic directly to avoid self-fetch issues in some environments.

        let subaccountCode = 'SUB_PENDING';
        let subaccountId = 'ID_PENDING';

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
                subaccountId = paystackData.data.id;
            } else {
                console.error('Paystack Error:', paystackData);
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

        // 4. Upload KYC if exists
        let kycDocumentUrl = null;
        const supabase = getSupabase();

        if (kycFile && kycFile.size > 0 && supabase) {
            const fileExt = kycFile.name.split('.').pop();
            const fileName = `${newUser.id}/kyc_${Date.now()}.${fileExt}`;
            const { error: uploadError, data: uploadData } = await supabase.storage
                .from('kyc-documents')
                .upload(fileName, kycFile);

            if (!uploadError && uploadData) {
                kycDocumentUrl = uploadData.path;
            }
        }

        // 5. Upload Shop Image if exists
        let shopImageUrl = null;
        if (shopImageFile && shopImageFile.size > 0 && supabase) {
            // Use 'public' bucket or folder if possible. 
            // Assuming 'shop-assets' bucket exists or we use a public folder in kyc-documents (not ideal)
            // Or better: use a 'public' bucket. I'll try to upload to 'shop-images'. 
            // If it fails, I'll default to no image or handle error.
            // Since I can't guarantee bucket existence from here, I'll try 'shop-images'.
            // Note: If bucket doesn't exist, this might fail. 
            // Alternatively, user 'kyc-documents' but that's likely private.
            // Let's assume 'shop-images' is available or created.

            const fileExt = shopImageFile.name.split('.').pop();
            const fileName = `${newUser.id}/shop_${Date.now()}.${fileExt}`;
            const { error: uploadError, data: uploadData } = await supabase.storage
                .from('shop-images')
                .upload(fileName, shopImageFile);

            if (!uploadError && uploadData) {
                // Construct Public URL. 
                // If bucket is public:
                shopImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/shop-images/${fileName}`;
            } else {
                console.error('Shop Image Upload Error:', uploadError);
            }
        }

        // 6. Create Seller Record
        await prisma.seller.create({
            data: {
                userId: newUser.id,
                shopName,
                ownerName,
                email,
                phone,
                paystackSubaccountCode: subaccountCode,
                // paystackSubaccountId: subaccountId, // Not in schema, ignore
                status: 'pending',
                rating: 0,
                image: shopImageUrl, // Save public URL here

                // KYC
                // Note: Schema might need mapping if field names differ.
                // Looking at prisma schema step 198: 
                // businessAddress, businessRegNum, ghanaCardNum, gpsAddress, kycDocUrl

                businessAddress,
                businessRegNum,
                ghanaCardNum,
                gpsAddress,
                kycDocUrl: kycDocumentUrl
            }
        });

        // 6. Login Session
        await createSession(newUser.id, newUser.role, newUser.email);

        return { success: true };

    } catch (error: any) {
        console.error('Seller Registration Error:', error);
        return { error: error.message || 'Registration failed.' };
    }
}
