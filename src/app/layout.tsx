import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import { getSession } from '@/utils/session';

import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://orivomart.com'), // Replace with actual production URL
  title: {
    default: 'OrivoMart | Premier Online Marketplace in Ghana & Africa',
    template: '%s | OrivoMart'
  },
  description: 'Shop the best deals on electronics, fashion, groceries, and more at OrivoMart. Fast delivery across Ghana and Africa. Secure payments and verified sellers.',
  keywords: ['Online Shopping Ghana', 'E-commerce Africa', 'Buy Electronics Accra', 'Fashion Marketplace', 'OrivoMart', 'Ghana Market', 'Verified Sellers'],
  authors: [{ name: 'OrivoMart Team' }],
  creator: 'OrivoMart Inc.',
  publisher: 'OrivoMart Inc.',
  openGraph: {
    type: 'website',
    locale: 'en_GH',
    url: 'https://orivomart.com',
    title: 'OrivoMart | Premier Online Marketplace in Ghana & Africa',
    description: 'Experience top-tier online shopping in Ghana. Buy items from verified sellers with fast delivery and secure payment protection.',
    siteName: 'OrivoMart',
    images: [
      {
        url: '/logo.png', // Ensure this image is high quality
        width: 1200,
        height: 630,
        alt: 'OrivoMart Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OrivoMart | Best Online Shopping in Ghana',
    description: 'Join thousands of shoppers on OrivoMart. Best prices, delivery to your doorstep.',
    images: ['/logo.png'],
    creator: '@orivomart',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <ToastProvider>
          <CartProvider>
            <Navbar user={session} />
            <main style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1 }}>
                {children}
              </div>
              <Footer />
            </main>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
