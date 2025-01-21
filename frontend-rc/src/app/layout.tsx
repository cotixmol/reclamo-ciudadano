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
  icons: {
    icon: '/favicon.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const claimTypes = await fetchClaimTypes(); // Server-side fetch

  return (
    <html lang="en">
      <body className="relative min-h-screen bg-gray-900 text-gray-200">
        <ClaimTypesProvider claimTypes={claimTypes}>
          <div className="pb-28">{children}</div>{' '}
          {/* Add padding for nav bar */}
          <BottomNavBar />
        </ClaimTypesProvider>
      </body>
    </html>
  );
}
