'use client';
import React from 'react';
import '../../../i18n';
import { useTranslation } from 'react-i18next';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/app/components/LoadingScreen';
import { ClaimCreateRequest } from '../types/types';
import { createClaim } from '@/app/services/claims/create';
import { TiDelete } from 'react-icons/ti';

export default function ClaimForm() {
  const router = useRouter();
  const { t } = useTranslation('claimcreationform');

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [status] = useState<string>('Open');
  const [type_category_id] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const claimData: ClaimCreateRequest = {
      title,
      description,
      status,
      type_category_id,
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
          <div>
            <label className="block mb-1" htmlFor="title">
              {t('claimTitle')}
            </label>
            <div className="flex items-start bg-gray-700 rounded focus-within:ring-2 focus-within:ring-primary">
              <input
                id="title"
                type="text"
                placeholder={t('placeholder.enterTitle')}
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

          <div>
            <label className="block mb-1" htmlFor="description">
              {t('claimDescription')}
            </label>
            <div className="flex items-start bg-gray-700 rounded focus-within:ring-2 focus-within:ring-primary">
              <textarea
                id="description"
                placeholder={t('placeholder.enterDescription')}
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
                aria-label={t('Clear')}
              >
                <TiDelete className="w-6 h-6" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {description.length}
              {t('1000characters')}
            </p>
          </div>

          <div>
            <label className="block mb-1" htmlFor="latitude">
              {t('claimLatitude')}
            </label>
            <input
              id="latitude"
              type="number"
              step="any"
              placeholder={t('placeholder.enterLatitude')}
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
              className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block mb-1" htmlFor="longitude">
              {t('claimLongitude')}
            </label>
            <input
              id="longitude"
              type="number"
              step="any"
              placeholder={t('placeholder.enterLongitude')}
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
              className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded transition ${
              isSubmitting
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
