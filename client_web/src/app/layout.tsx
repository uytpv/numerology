import './globals.css';
import { AuthProvider } from '../lib/auth';
import { LanguageProvider } from '../lib/i18n';
import { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Life Maps - Bản Đồ Vận Mệnh & Khoa Học Số Học Pythagoras',
  description: 'Life Maps - Khám phá bản sắc cuộc đời, vận hạn và lộ trình phát triển bản thân dưới góc nhìn khoa học Pythagoras',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${playfair.variable} font-sans antialiased`}
      >
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
