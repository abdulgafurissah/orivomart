
import 'server-only';
import { cookies } from 'next/headers';
import { encrypt, decrypt } from './auth-helpers';

export { encrypt, decrypt };

export async function createSession(userId: string, role: string, email: string) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
    const session = await encrypt({ userId, role, email, expires });

    const isSecure = process.env.NODE_ENV === 'production'; // Ensure this is false in dev
    console.log(`[createSession] Creating session for ${email}. Secure: ${isSecure}`);

    (await cookies()).set('session', session, {
        httpOnly: true,
        secure: isSecure,
        expires: expires,
        sameSite: 'lax',
        path: '/',
    });
}

export async function getSession() {
    const session = (await cookies()).get('session')?.value;
    if (!session) return null;
    try {
        return await decrypt(session);
    } catch (error) {
        return null;
    }
}

export async function deleteSession() {
    (await cookies()).delete('session');
}
