import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from 'react-hot-toast';
import ReactQueryProvider from '@/components/Providers/ReactQueryProvider';
import ClientLayoutProvider from '@/components/Providers/ClientLayoutProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'STG Catalog - E-commerce Moderno',
  description:
    'Sistema completo de e-commerce com autenticação e integração WhatsApp',
  keywords: [
    'ecommerce',
    'catalog',
    'whatsapp',
    'react',
    'nextjs',
  ],
  authors: [{ name: 'STG Team' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#22c55e',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <head></head>
      <body
        className={`${inter.className} h-full bg-white dark:bg-gray-900`}
        suppressHydrationWarning={true}
      >
        <ReactQueryProvider>
          <AuthProvider>
            <CartProvider>
              <ClientLayoutProvider />
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    style: {
                      background: '#22c55e',
                    },
                  },
                  error: {
                    style: {
                      background: '#ef4444',
                    },
                  },
                }}
              />
              {children}
            </CartProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
