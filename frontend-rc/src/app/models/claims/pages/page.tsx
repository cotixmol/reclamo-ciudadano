'use client';

import React, { useState, useEffect } from 'react';
import { ClaimResponse } from '../types/claim';
import ClaimCard from '../components/ClaimCard';
import LoadingScreen from '@/app/components/LoadingScreen';
import ErrorPage from '@/app/components/ErrorPage';
import ClaimNotFoundPage from '../components/ClaimNotFound';
import { fetchAllClaimsByPublicIds } from '@/app/services/claims/fetch';

export default function ClaimsPage() {
  const [claims, setClaims] = useState<ClaimResponse[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 1) Hardcode an array of 10 images
  const images = [
    'https://media.istockphoto.com/id/465926255/photo/damaged-road.jpg?s=612x612&w=0&k=20&c=BpAIGaTwkmxrlJEJlpKIWtd1ccKITuozvaRxXMj3Zr0=',
    'https://www.shutterstock.com/image-photo/arrow-street-sign-that-now-600nw-2165056153.jpg',
    'https://static.vecteezy.com/system/resources/thumbnails/027/022/196/small_2x/realistic-of-rubbish-garbage-spreading-on-the-street-ai-generative-photo.jpg',
    'https://gray-wvva-prod.gtv-cdn.com/resizer/v2/3EU7E4Y3ZBCJVMFFWGEEETWODU.PNG?auth=506722de62a5ba5a9778155c8b0d04553e3e6770cdeb379b684c67ab6fd368ae&width=800&height=450&smart=true',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRIeFWOBIOefLnw8DiPUvDK8se0XkdftEnDA&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI-WWmvvic34KS-2eaKFzvqfR_DshoM36ZGA&s',
    'https://cmstahllaw.com/wp-content/uploads/2022/12/types-of-felony-theft-shreveport.jpg',
  ];

  useEffect(() => {
    const loadClaims = async () => {
      setIsLoading(true);
      try {
        const claimsData = await fetchAllClaimsByPublicIds();
        // If you want them in reverse order:
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
        {/* 2) For each card, pick a random index from 0–9 to select the image */}
        {claims.map((claim) => {
          const randomIndex = Math.floor(Math.random() * images.length);
          return (
            <ClaimCard
              key={claim.publicId}
              claim={claim}
              setIsDeleting={setIsDeleting}
              imageUrl={images[randomIndex]}
            />
          );
        })}
      </div>
    </div>
  );
}
