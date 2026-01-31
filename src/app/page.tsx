
import { getPublicProducts, getPublicSellers } from './actions/public-actions';
import { getCategories } from './actions/category-actions';
import { getSession } from '@/utils/session';
import HomeClient from './home-client';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [products, categories, session] = await Promise.all([
    getPublicProducts(),
    getCategories(),
    getSession()
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'OrivoMart',
    url: 'https://orivomart.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://orivomart.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OrivoMart',
    url: 'https://orivomart.com',
    logo: 'https://orivomart.com/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+233-000-0000',
      contactType: 'customer service',
      areaServed: ['GH', 'NG', 'KE', 'ZA'],
      availableLanguage: ['en'],
    },
    sameAs: [
      'https://twitter.com/orivomart',
      'https://facebook.com/orivomart',
      'https://instagram.com/orivomart'
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <HomeClient products={products} sellers={[]} user={session} categories={categories} />
    </>
  );
}
