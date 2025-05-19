'use client';

import React, { useState, useEffect } from 'react';
import { ClaimWithMultimediaResponse } from '../../models/claims/types/claim';
import ClaimCard from '../../models/claims/components/ClaimCard';
import LoadingScreen from '@/app/components/LoadingScreen';
import ErrorPage from '@/app/components/ErrorPage';
import ClaimNotFoundPage from '../../models/claims/components/ClaimNotFound';
import { fetchAllClaimsByPublicIds } from '@/app/services/claims/fetch';

export default function ClaimsPage() {
  const [claims, setClaims] = useState<ClaimWithMultimediaResponse[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const getStoredPublicIds = (): string[] => {
    const existing = localStorage.getItem('publicIds');
    return existing ? JSON.parse(existing) : [];
  };

  useEffect(() => {
    const loadClaims = async () => {
      setIsLoading(true);
      try {
        const publicIds = getStoredPublicIds();
        const claimsData = await fetchAllClaimsByPublicIds(publicIds);
        setClaims(claimsData.reverse());
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClaims();
  }, []);

  if (isLoading || isDeleting) {
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
          <ClaimCard
            key={claimData.claim.publicId}
            claimData={claimData}
            setIsDeleting={setIsDeleting}
          />
        ))}
      </div>
    </div>
  );
}
