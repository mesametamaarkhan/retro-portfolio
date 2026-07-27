import './globals.css';
import type { Metadata } from 'next';
import { VT323, IBM_Plex_Mono } from 'next/font/google';
import { AdminProvider } from '@/lib/admin-context';
import { Scanlines } from '@/components/scanlines';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';

const vt323 = VT323({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-vt323',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mesam E Tamaar Khan',
  description: 'A personal portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${vt323.variable} ${plexMono.variable}`}>
      <body className="min-h-screen bg-crt-bg text-crt-text font-mono antialiased">
        <AdminProvider>
          <Scanlines />
          <div className="relative z-10 flex min-h-screen flex-col">
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AdminProvider>
      </body>
    </html>
  );
}
