import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { CartProvider } from '@/context/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Agifarmz | Premium Agricultural Supplies',
  description: 'The premier marketplace for farmers to buy seeds, feeds, and equipment.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Navbar />
          <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
