import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Explicitly load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config(); // fallback to .env

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env or .env.local');
    console.error('Current Keys found:', {
        url: !!supabaseUrl,
        key: !!serviceRoleKey ? 'Found' : 'Missing'
    });
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);
const prisma = new PrismaClient();

async function main() {
    const email = 'admin@sahalmall.com';
    const password = 'Admin@123';

    console.log(`Fixing Admin Account for: ${email}`);

    // 1. Ensure User exists in Supabase Auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('Error listing users:', listError);
        process.exit(1);
    }

    let userId = users.find(u => u.email === email)?.id;

    if (userId) {
        console.log('User exists in Supabase. Updating password...');
        const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
            password: password,
            email_confirm: true,
            user_metadata: { full_name: 'System Admin' }
        });
        if (updateError) console.error('Error updating password:', updateError);
        else console.log('Password reset to: Admin@123');
    } else {
        console.log('User missing in Supabase. Creating...');
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: 'System Admin' }
        });

        if (createError) {
            console.error('Error creating user:', createError);
            process.exit(1);
        }

        userId = newUser.user.id;
        console.log('Supabase Auth User created.');
    }

    // 2. Ensure Profile exists in Neon (Prisma)
    console.log('Syncing to Neon Database...');
    if (!userId) throw new Error('No User ID found');

    await prisma.profile.upsert({
        where: { email },
        update: {
            id: userId, // Sync ID with Supabase
            role: 'admin',
            fullName: 'System Admin'
        },
        create: {
            id: userId,
            email,
            role: 'admin',
            fullName: 'System Admin',
            password: 'SUPABASE_SYNCED' // Placeholder as auth is handled via Supabase for this user
        }
    });

    console.log('✅ Admin Account Fixed!');
    console.log('Email: admin@sahalmall.com');
    console.log('Password: Admin@123');
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
