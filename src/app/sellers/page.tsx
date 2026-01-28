
import { getPublicSellers } from '../actions/public-actions';
import SellersClient from './sellers-client';

export const dynamic = 'force-dynamic';

export default async function SellersPage() {
    const sellers = await getPublicSellers();

    return <SellersClient shops={sellers} />;
}
