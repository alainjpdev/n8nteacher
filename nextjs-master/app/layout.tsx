import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import ConditionalLayout from '../components/conditional-layout'; // 👈 nuevo

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MiCasApp | Find Your Dream Home',
  description: 'Discover your perfect home with MiCasApp - the modern real estate marketplace',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover',
  themeColor: '#ffffff',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MiCasApp'
  },
  formatDetection: {
    telephone: true
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} h-full`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}