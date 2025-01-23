'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { validate as isUUID } from 'uuid';
import Image from 'next/image';
import { FiArrowLeft } from 'react-icons/fi';

import { fetchClaimByPublicId } from '@/app/services/claims/fetch';
import LoadingScreen from '@/app/components/LoadingScreen';
import ErrorPage from '@/app/components/ErrorPage';
import ClaimNotFoundPage from '../../components/ClaimNotFound';
import { ClaimResponse } from '../../types/claim';
import { UUID } from 'crypto';

export default function ClaimDetailsPage() {
  const params = useParams() as { publicId: UUID };
  const router = useRouter();

  const [claim, setClaim] = useState<ClaimResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadClaim = async () => {
      if (!isUUID(params.publicId)) {
        setError(new Error('The requested claim was not found'));
        setIsLoading(false);
        return;
      }

      try {
        const data = await fetchClaimByPublicId(params.publicId);
        setClaim(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClaim();
  }, [params.publicId]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorPage message={error.message} />;
  }

  if (!claim) {
    return <ClaimNotFoundPage />;
  }

  return (
    <div className="min-h-screen p-5 bg-gray-800 text-gray-200 flex flex-col">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-[#e4047d] hover:text-[#ff4da6] transition duration-200"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/0/05/Burnout_ops_on_Mangum_Fire_McCall_Smokejumpers.jpg"
        alt={claim.title}
        width={800}
        height={500}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
      <h1 className="text-2xl font-semibold text-gray-100 mb-4">
        {claim.title}
      </h1>
      <p className="text-gray-300">{claim.description}</p>

      <div className="mt-6 flex-grow">
        {/* Placeholder for more details or editing features */}
        <div className="p-4 bg-gray-700 rounded-lg">
          <p className="text-gray-400">
            More details or editing section here...
          </p>
        </div>
      </div>
    </div>
  );
}
