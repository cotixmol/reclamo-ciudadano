'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

import LoadingScreen from '@/app/components/LoadingScreen';
import { createClaim } from '@/app/services/claims/create';
import { ClaimCreateRequest } from '../types/types';
import { TiDelete } from 'react-icons/ti';
import dynamic from 'next/dynamic';

const MapSelector = dynamic(() => import('./MapSelector'), {
  ssr: false,
});

export default function ClaimForm() {
  const router = useRouter();
  const { t } = useTranslation('claimcreationform');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationName, setLocationName] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // For enabling the submit if lat/long are set
  const hasLocation = !!latitude && !!longitude;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const claimData: ClaimCreateRequest = {
      title,
      description,
      status: 'Open',
      type_category_id: 1,
      claim_location: {
        type: 'Point',
        coordinates: [parseFloat(latitude), parseFloat(longitude)],
      },
    };

    try {
      await createClaim(claimData);
      router.push('/models/claims/pages');
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-3xl bg-gray-900 p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-6">{t('formTitle')}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block mb-1">
              {t('claimTitle')}
            </label>
            <div className="flex items-start bg-gray-700 rounded focus-within:ring-2 focus-within:ring-primary">
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={200}
                className="flex-grow p-2 bg-transparent text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setTitle('')}
                className="px-2 py-2 text-sm hover:text-white"
              >
                <TiDelete className="w-6 h-6" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {title.length}
              {t('200characters')}
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block mb-1">
              {t('claimDescription')}
            </label>
            <div className="flex items-start bg-gray-700 rounded focus-within:ring-2 focus-within:ring-primary">
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                maxLength={1000}
                className="flex-grow p-2 bg-transparent text-white focus:outline-none resize-none"
                rows={7}
              />
              <button
                type="button"
                onClick={() => setDescription('')}
                className="px-2 py-2 self-start text-sm hover:text-white"
                aria-label="Clear"
              >
                <TiDelete className="w-6 h-6" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {description.length}
              {t('1000characters')}
            </p>
          </div>

          {/* Map */}
          <div className="w-full rounded overflow-hidden ">
            {/* New heading and subtitle */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold">
                {t('selectLocationTitle')}
              </h3>
              <p className="text-sm text-gray-400">
                {t('selectLocationSubtitle')}
              </p>
            </div>
            <MapSelector
              latitude={latitude}
              longitude={longitude}
              onLocationChangeAction={(lat, lng, address) => {
                setLatitude(lat);
                setLongitude(lng);
                if (address) setLocationName(address);
              }}
            />
          </div>

          {/* Show chosen address if you like */}
          {hasLocation && locationName && (
            <p className="text-sm mt-2">
              <span className="font-semibold">{t('chosenAddress')}:</span>{' '}
              <span className="text-gray-400">{locationName}</span>
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!hasLocation || isSubmitting}
            className={`w-full py-2 px-4 rounded transition ${
              !hasLocation || isSubmitting
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-hover'
            }`}
          >
            {t('claimSubmitButton')}
          </button>
        </form>
      </div>
    </div>
  );
}
