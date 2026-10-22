import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AmbientLight } from '@/components/layout/AmbientLight';
import { Particles } from '@/components/layout/Particles';
import { AlertProvider } from '@/context/AlertContext';

export const metadata: Metadata = {
  title: 'GenPass - Secure & Memorable Password Generator',
  description: 'A privacy-focused, client-side password generator using cryptographically secure algorithms.',
  icons: {
    icon: '/icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#121212',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-neutral-950 text-white font-sans antialiased selection:bg-indigo-500 selection:text-white">
        <div className="fixed inset-0 animated-gradient opacity-90 -z-20 pointer-events-none" />
        <AmbientLight />
        <Particles />
        <AlertProvider>
          <Navbar />
          <main className="flex-grow flex flex-col pt-16">
            {children}
          </main>
          <Footer />
        </AlertProvider>
      </body>
    </html>
  );
}
