// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { GeistMonoVF, GeistVF } from './fonts';

export const metadata: Metadata = {
  title: 'Meet Halfway',
  description: 'Find the best meeting point!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${GeistMonoVF.variable} ${GeistVF.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
