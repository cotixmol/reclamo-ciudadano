// components/ClaimForm.tsx
'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import '../../../../i18n';
import LoadingScreen from '@/app/components/LoadingScreen';
import { createClaim } from '@/app/services/claims/create';
import { ClaimCreateRequest, PriorityEnum } from '../../types/claim';
import dynamic from 'next/dynamic';
import TitleInput from './TitleInput';
import DescriptionInput from './DescriptionInput';
import MultimediaUpload from './MultimediaUpload';
import PrioritySection from './PrioritySection';
import SubmitButton from './SubmitButton';
import ClaimTypesDropdown from '@/app/models/claimTypes/components/claimTypesDropdown';
import LoadingMap from './Map/LoadingMap';

const MapSelector = dynamic(() => import('./Map/MapSelector'), {
  ssr: false,
  loading: () => <LoadingMap />,
});

export default function ClaimForm() {
  const router = useRouter();
  const { t } = useTranslation('claimcreationform');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationName, setLocationName] = useState('');
  const [selectedClaimTypeId, setSelectedClaimTypeId] = useState<number | null>(
    null
  );
  const [priority, setPriority] = useState<PriorityEnum>(PriorityEnum.LOW);

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
      type_category_id: selectedClaimTypeId ?? 1,
      claim_location: {
        type: 'Point',
        coordinates: [parseFloat(latitude), parseFloat(longitude)],
      },
      priority,
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
          {/* Title Input */}
          <TitleInput title={title} setTitle={setTitle} />

          {/* Priority Section */}
          <PrioritySection priority={priority} setPriority={setPriority} />

          {/* Claim Type Dropdown */}
          <ClaimTypesDropdown
            selectedClaimTypeId={selectedClaimTypeId}
            onChangeAction={(newId) => setSelectedClaimTypeId(newId)}
          />

          {/* Description Input */}
          <DescriptionInput
            description={description}
            setDescription={setDescription}
          />

          {/* Multimedia Upload */}
          <MultimediaUpload />

          {/* Map Selector */}
          <div className="w-full rounded overflow-hidden relative z-0">
            <div className="mb-4">
              <h3 className="block mb-1">{t('selectLocationTitle')}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {t('selectLocationSubtitle')}
              </p>
              {/* "My Location" Button */}
              <div className="mt-2">
                <button
                  type="button"
                  disabled
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover cursor-not-allowed"
                >
                  {t('myLocation', 'My Location (Coming Soon)')}
                </button>
              </div>
            </div>
            <div className="relative z-0">
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
          </div>

          {/* Show chosen address */}
          {hasLocation && locationName && (
            <p className="text-sm mt-2">
              <span className="font-semibold">{t('chosenAddress')}:</span>{' '}
              <span className="text-gray-400">{locationName}</span>
            </p>
          )}

          {/* Submit Button */}
          <SubmitButton disabled={!hasLocation} isSubmitting={isSubmitting} />
        </form>
      </div>
    </div>
  );
}
