
import { getPublicProducts, getPublicSellers } from './actions/public-actions';
import HomeClient from './home-client';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await getPublicProducts();
  const sellers = await getPublicSellers();

  return <HomeClient products={products} sellers={sellers} />;
}
