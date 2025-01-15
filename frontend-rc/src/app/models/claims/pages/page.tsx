'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ClaimResponse } from '../utils/types';
import ClaimCard from '../components/ClaimCard';
import LoadingScreen from '@/app/components/LoadingScreen';
import ErrorPage from '@/app/components/ErrorPage';
import ClaimNotFoundPage from '../components/ClaimNotFound';

export default function ClaimsPage() {
  const [claims, setClaims] = useState<ClaimResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchClaims = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post<ClaimResponse[]>('/api/claims', {
          public_ids: [
            '5dbd3aa7-2d69-419d-8f0e-7234bada27f6',
            '42197a29-66ec-45e0-a33d-1df2afba2f61',
          ],
        });
        setClaims(response.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClaims();
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
    <div className="bg-gray-800 p-4 flex justify-center items-start">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {claims.map((claim) => (
          <ClaimCard key={claim.publicId} claim={claim} />
        ))}
      </div>
    </div>
  );
}
