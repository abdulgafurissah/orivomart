
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SESSION_SECRET || 'default-secret-key-change-me-in-prod';

export async function encrypt(payload: any) {
    // Synchronous sign is fine for JWT in Node
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '24h', algorithm: 'HS256' });
}

export async function decrypt(input: string): Promise<any> {
    try {
        return jwt.verify(input, SECRET_KEY, { algorithms: ['HS256'] });
    } catch (error) {
        throw new Error('Invalid token');
    }
}
