import './globals.css';
import { AuthProvider } from '../lib/auth';
import { LanguageProvider } from '../lib/i18n';
import { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';

const inter = Inter({
  subsets: ['vietnamese'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const lora = Lora({
  subsets: ['vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bản Đồ Thần Số Học Pythagoras - Pythagorean Numerology',
  description: 'Khám phá bản sắc cuộc đời và giải pháp phát triển bản thân dưới góc nhìn tâm lý học khoa học',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${lora.variable} antialiased`}>
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

