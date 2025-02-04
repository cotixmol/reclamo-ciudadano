'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { validate as isUUID } from 'uuid';
import { FiArrowLeft } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import LoadingScreen from '@/app/components/LoadingScreen';
import ErrorPage from '@/app/components/ErrorPage';
import ClaimNotFoundPage from '../../components/ClaimNotFound';
import Carousel, { MediaFile } from '@/app/components/Carousel';
import { fetchClaimByPublicId } from '@/app/services/claims/fetch';
import { updateClaimByPublicId } from '@/app/services/claims/update';
import {
  ClaimWithMultimediaResponse,
  ClaimStatusEnum,
  PriorityEnum,
} from '../../types/claim';
import { getStatusColor, getPriorityColor } from '@/app/utils/claimColors';

const ClaimUpdatePage: React.FC = () => {
  const { t } = useTranslation('claimdetailspage');
  const params = useParams() as { publicId: string };
  const router = useRouter();

  const [claimData, setClaimData] =
    useState<ClaimWithMultimediaResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [formValues, setFormValues] = useState({ title: '', description: '' });
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadClaim = async () => {
      if (!isUUID(params.publicId)) {
        setError(new Error(t('invalidClaimId')));
        setIsLoading(false);
        return;
      }
      try {
        const data = await fetchClaimByPublicId(params.publicId);
        setClaimData(data);
        setFormValues({
          title: data.claim.title,
          description: data.claim.description,
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClaim();
  }, [params.publicId, t]);

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorPage message={error.message} />;
  if (!claimData) return <ClaimNotFoundPage />;

  const { claim, multimedia } = claimData;
  const mediaFiles: MediaFile[] =
    multimedia && multimedia.length > 0
      ? multimedia.map((m) => ({ url: m.s3Url, fileType: m.fileType }))
      : [];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateError(null);
    try {
      await updateClaimByPublicId(claim.publicId, {
        title: formValues.title,
        description: formValues.description,
      });
      router.push('/models/claims/pages');
    } catch (err) {
      setUpdateError((err as Error).message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen p-5 bg-gray-900">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-pink-500 hover:text-pink-400 transition duration-200"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{t('back')}</span>
          </button>
        </div>

        <div className="border-2 border-gray-700 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          {/* Carousel Section */}
          {mediaFiles.length > 0 && (
            <Carousel
              mediaFiles={mediaFiles}
              containerClassName="w-full h-64 md:h-80 relative"
              imageClassName="w-full h-full object-cover"
            />
          )}

          <div className="p-4">
            {/* Status & Priority Tags */}
            <div className="flex space-x-2 mb-4">
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(
                  claim.status
                )} text-gray-900`}
              >
                {t(`status.${claim.status}`)}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${getPriorityColor(
                  claim.priority
                )} text-gray-900`}
              >
                {t(`priority.${claim.priority}`)}
              </span>
            </div>

            <h1 className="text-2xl font-semibold text-gray-100 mb-2">
              {claim.title}
            </h1>
            <p className="text-gray-300 mb-4">{claim.description}</p>

            {/* Update Form */}
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-200"
                >
                  {t('title')}
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formValues.title}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full bg-gray-700 border border-gray-600 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-200"
                >
                  {t('description')}
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formValues.description}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full bg-gray-700 border border-gray-600 rounded-md"
                  rows={4}
                />
              </div>
              {updateError && (
                <p className="text-red-400 text-sm">{updateError}</p>
              )}
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
              >
                {isUpdating ? t('updating') : t('updateClaim')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimUpdatePage;
