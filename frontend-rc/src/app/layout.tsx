import React from 'react';
import { Metadata } from 'next';
import './globals.css';
import BottomNavBar from './components/BottomNavBar';
import { ClaimTypesProvider } from './context/ClaimTypesContext';
import { loadAllClaimsTypesAtBootstart } from './services/claim_types/fetch';
import PreloadMapSelector from './models/claims/components/ClaimForm/Map/PreloadMapSelector';

export const metadata: Metadata = {
  title: 'Reclamo Ciudadano',
  description:
    'Reporta problemas en tu ciudad y sigue el estado de los reclamos.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Reclamo Ciudadano',
  },

  icons: {
    icon: [
      { url: '/favicon.png' },
      { url: '/icon-192.png', sizes: '192x192' },
      { url: '/icon-512.png', sizes: '512x512' },
    ],
    apple: [{ url: '/icon-180.png', sizes: '180x180' }],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const claimTypes = await loadAllClaimsTypesAtBootstart();

  return (
    <html lang="en">
      <body className="relative min-h-screen bg-RCColors-900 text-RCColors-200">
        <ClaimTypesProvider claimTypes={claimTypes}>
          <div className="pb-28">{children}</div>
          <BottomNavBar />
          <PreloadMapSelector />
        </ClaimTypesProvider>
      </body>
    </html>
  );
}
