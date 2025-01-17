'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { ClaimResponse } from '../types/types';
import ClaimCard from '../components/ClaimCard';
import LoadingScreen from '@/app/components/LoadingScreen';
import ErrorPage from '@/app/components/ErrorPage';
import ClaimNotFoundPage from '../components/ClaimNotFound';
import { fetchAllClaimsByPublicIds } from '@/app/services/claims/fetch';

export default function ClaimsPage() {
  const [claims, setClaims] = useState<ClaimResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadClaims = async () => {
      setIsLoading(true);
      try {
        const claimsData = await fetchAllClaimsByPublicIds();
        setClaims(claimsData);
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
    <div className="p-4 flex justify-center items-start">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {claims.map((claim) => (
          <ClaimCard key={claim.publicId} claim={claim} />
        ))}
      </div>
    </div>
  );
}
