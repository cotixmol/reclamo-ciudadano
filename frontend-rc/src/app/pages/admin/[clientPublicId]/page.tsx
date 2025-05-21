'use client';
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { ClaimWithMultimediaResponse } from '../../../models/claims/types/claim';
import LoadingScreen from '@/app/components/LoadingScreen';
import ErrorPage from '@/app/components/ErrorPage';
import ClaimNotFoundPage from '../../../models/claims/components/ClaimNotFound';
import { fetchAllClaimsByClientId } from '@/app/services/admin/claims/fetch';

// This page needs changes. Is not definitive.

export default function AdminPage() {
  const params = useParams() as { clientPublicId: string };
  const [claims, setClaims] = useState<ClaimWithMultimediaResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadClaims = async () => {
      setIsLoading(true);
      try {
        const claimsData = await fetchAllClaimsByClientId(
          params.clientPublicId
        );
        setClaims(claimsData.reverse());
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClaims();
  }, [params.clientPublicId]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorPage message={error.message} />;
  }

  if (!claims || claims.length === 0) {
    return <ClaimNotFoundPage />;
  }

  return (
    <div className="p-5 flex justify-center items-start">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {claims.map((claim) => (
          <div
            key={claim.claim.id} // ✅ React list key
            className="border p-4 rounded shadow-sm text-sm"
          >
            <p className="font-semibold mb-1">
              {claim.claim.title ?? `Claim #${claim.claim.id}`}
            </p>
            <p className="mb-2">Status: {claim.claim.status}</p>
            {/* quick JSON dump for debugging */}
            <pre className="whitespace-pre-wrap break-all">
              {JSON.stringify(claim, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
