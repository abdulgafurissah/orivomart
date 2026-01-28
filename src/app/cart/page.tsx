
import CartClient from './cart-client';
import { getSession } from '@/utils/session';

export default async function CartPage() {
    const session = await getSession();
    return <CartClient user={session} />;
}
