import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import BottomNavBar from './components/BottomNavBar';
import { ClaimTypesResponse } from './models/claimTypes/types/claimTypes';
import { ClaimTypesProvider } from './context/ClaimTypesContext';

async function fetchClaimTypes(): Promise<ClaimTypesResponse[]> {
  const res = await fetch(`${process.env.API_URL}/claim_types`, {
    next: { revalidate: 600 },
  });

  if (!res.ok) {
    console.error('Failed to fetch claim types:', res.statusText);
    return [];
  }

  const data: ClaimTypesResponse[] = await res.json();
  return data;
}

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
  const claimTypes = await fetchClaimTypes();

  return (
    <html lang="en">
      <body className="relative min-h-screen bg-gray-900 text-gray-200">
        <ClaimTypesProvider claimTypes={claimTypes}>
          <div className="pb-28">{children}</div>
          <BottomNavBar />
        </ClaimTypesProvider>
      </body>
    </html>
  );
}
