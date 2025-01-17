'use client';
import React from 'react';
import '../../../i18n';
import { useTranslation } from 'react-i18next';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/app/components/LoadingScreen';
import { ClaimCreateRequest } from '../types/types';
import { createClaim } from '@/app/services/claims/create';

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
            <input
              id="title"
              type="text"
              placeholder={t('placeholder.enterTitle')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block mb-1" htmlFor="description">
              {t('claimDescription')}
            </label>
            <textarea
              id="description"
              placeholder={t('placeholder.enterDescription')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
            />
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
