'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch } from 'react-icons/fi';
import '../../../i18n';
import { useTranslation } from 'react-i18next';

const ClaimNotFoundPage: React.FC = () => {
  const { t } = useTranslation('claimnotfound');
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-112px)] bg-gray-900 text-gray-200 px-4">
      <FiSearch className="text-primary w-16 h-16 mb-4" />
      <h1 className="text-2xl font-bold text-gray-100 mb-2">
        {t('noClaimsTitle')}
      </h1>
      <p className="text-gray-400 mb-6 text-center">
        {t('noClaimsDescription')}
      </p>
      <button
        onClick={() => router.back()}
        className="bg-primary px-6 py-3 rounded-full shadow-md hover:bg-primary-hover transition duration-200"
      >
        {t('createNewClaim')}
      </button>
    </div>
  );
};

export default ClaimNotFoundPage;
