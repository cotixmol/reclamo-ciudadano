'use client';
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { ClaimWithMultimediaResponse } from '../../../models/claims/types/claim';
import LoadingScreen from '@/app/components/LoadingScreen';
import ErrorPage from '@/app/components/ErrorPage';
import ClaimNotFoundPage from '../../../models/claims/components/ClaimNotFound';
import { fetchAllClaimsByClientId } from '@/app/services/admin/claims/fetch';

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
  }, []);

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
        {claims.map((claimData) => (
          <div></div>
        ))}
      </div>
    </div>
  );
}
