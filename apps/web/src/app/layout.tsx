import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond as Garamond } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import { ToastProvider } from '@/components/ui/Toast';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SiteProviders } from '@/components/gui/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const garamond = Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'FamilyConnect — Keep your family in sync',
  description:
    'FamilyConnect helps families discover, connect, and stay aligned — sharing moments, events, and everyday reminders in one calm space.',
  keywords: ['family', 'connections', 'events', 'sharing', 'family app'],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${garamond.variable} min-h-screen flex flex-col bg-ink-50 text-ink-900 font-sans antialiased`}
      >
        <AuthProvider>
          <ToastProvider>
            <SiteProviders>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </SiteProviders>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
