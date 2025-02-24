'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import '../../../../i18n';
import LoadingScreen from '@/app/components/LoadingScreen';
import ErrorPage from '@/app/components/ErrorPage';
import { createClaim } from '@/app/services/claims/create';
import {
  markClaimAsFailed,
  markClaimAsFinished,
} from '@/app/services/claims/markProcessingStatus';
import { ClaimCreateRequest, PriorityEnum } from '../../types/claim';
import dynamic from 'next/dynamic';
import TitleInput from './TitleInput';
import DescriptionInput from './DescriptionInput';
import MultimediaUpload from './MultimediaUpload';
import PrioritySection from './PrioritySection';
import SubmitButton from './SubmitButton';
import ClaimTypesDropdown from '@/app/models/claimTypes/components/claimTypesDropdown';
import LoadingMap from './Map/LoadingMap';
import { PutObjectInS3 } from '@/app/services/s3/putObject';
import { saveMetadata } from '@/app/services/multimedia/saveMetadata';

const MapSelector = dynamic(() => import('./Map/MapSelector'), {
  ssr: false,
  loading: () => <LoadingMap />,
});

export default function ClaimForm() {
  const router = useRouter();
  const { t } = useTranslation('claimcreationform');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationName, setLocationName] = useState('');
  const [selectedClaimTypeId, setSelectedClaimTypeId] = useState<number | null>(
    null
  );
  const [priority, setPriority] = useState<PriorityEnum>(PriorityEnum.LOW);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const hasLocation = Boolean(latitude && longitude);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!hasLocation) {
      setLocationError(true);
      return;
    }
    setLocationError(false);
    setIsSubmitting(true);
    setError(null);

    const fileSizesByName = files.reduce(
      (accumulator, file) => {
        accumulator[file.name] = file.size;
        return accumulator;
      },
      {} as Record<string, number>
    );

    const claimData: ClaimCreateRequest = {
      title,
      description,
      status: 'Open',
      type_category_id: selectedClaimTypeId ?? 1,
      claim_location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      address: locationName,
      priority,
      files: fileNames,
      file_sizes: fileSizesByName,
    };

    try {
      const response = await createClaim(claimData);
      const { newClaim, presignedUrl } = response;
      const { id, publicId } = newClaim;

      if (newClaim.hasMultimedia && files.length > 0) {
        try {
          const uploadPromises = files.map((file) =>
            PutObjectInS3(presignedUrl[file.name], file)
          );
          await Promise.all(uploadPromises);
        } catch (err) {
          await markClaimAsFailed(publicId);
          throw err;
        }

        try {
          await saveMetadata(id, presignedUrl, files);
        } catch (err) {
          await markClaimAsFailed(publicId);
          throw err;
        }
      }

      await markClaimAsFinished(publicId);
      router.push('/models/claims/pages');
    } catch (err) {
      console.error(err);
      setError(err as Error);
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorPage message={error.message} />;
  }

  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-6">{t('formTitle')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TitleInput title={title} setTitle={setTitle} />
          <PrioritySection priority={priority} setPriority={setPriority} />
          <ClaimTypesDropdown
            selectedClaimTypeId={selectedClaimTypeId}
            onChangeAction={(newId) => setSelectedClaimTypeId(newId)}
          />
          <DescriptionInput
            description={description}
            setDescription={setDescription}
          />
          <MultimediaUpload
            fileNames={fileNames}
            setFileNames={setFileNames}
            files={files}
            setFiles={setFiles}
          />
          <div className="w-full rounded overflow-hidden relative z-0">
            <div className="mb-4">
              <h3 className="block mb-1">{t('selectLocationTitle')}</h3>
              <p className="text-RCColors-400 mt-1">
                {t('selectLocationSubtitle')}
              </p>
            </div>
            <div className="relative w-full h-64">
              <MapSelector
                latitude={latitude}
                longitude={longitude}
                onLocationChangeAction={(lat, lng, address) => {
                  setLatitude(lat);
                  setLongitude(lng);
                  if (address) setLocationName(address);
                  if (lat && lng) setLocationError(false);
                }}
              />
            </div>
          </div>
          {hasLocation && locationName && (
            <p className="text-sm mt-2">
              <span className="font-semibold">{t('chosenAddress')}:</span>{' '}
              <span className="text-RCColors-400">{locationName}</span>
            </p>
          )}
          <SubmitButton
            isSubmitting={isSubmitting}
            locationError={locationError}
          />
        </form>
      </div>
    </div>
  );
}
