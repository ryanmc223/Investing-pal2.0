import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Investing Pal',
  description: 'Understand markets. Research thoughtfully. Practice with virtual money.',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Investing Pal' },
  manifest: '/manifest.json',
};
export const viewport: Viewport = {
  themeColor: '#101b2b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
