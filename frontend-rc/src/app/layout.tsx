import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import BottomNavBar from './components/BottomNavBar';

export const metadata: Metadata = {
  title: 'Reclamo Ciudadano',
  description:
    'Reporta problemas en tu ciudad y sigue el estado de los reclamos.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative min-h-screen bg-gray-900 text-gray-200">
        <div className="pb-28">{children}</div> {/* Add padding for nav bar */}
        <BottomNavBar />
      </body>
    </html>
  );
}
