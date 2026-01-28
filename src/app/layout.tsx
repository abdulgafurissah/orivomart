import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { CartProvider } from '@/context/CartContext';
import { getSession } from '@/utils/session';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OrivoMart | Official Marketplace',
  description: 'The premier marketplace for top brands, electronics, fashion, and more.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <CartProvider>
          <Navbar user={await getSession()} />
          <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
