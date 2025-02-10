'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; // <-- Import the Next.js 13 router
import { FiAlertCircle } from 'react-icons/fi';
import '../i18n';
import { useTranslation } from 'react-i18next';

interface ErrorPageProps {
  message: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ message }) => {
  const { t } = useTranslation('errorpage');
  const router = useRouter(); // <-- Initialize the router

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="flex justify-center bg-gray-900 px-4 pt-64">
      <div className="max-w-md w-full mx-4 text-center p-6 shadow-lg shadow-black/30 bg-gray-800 rounded-lg border-t-4 border-primary">
        <div className="flex justify-center">
          <FiAlertCircle className="text-primary w-16 h-16 mb-4" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{t('title')}</h1>
        <p className="text-gray-400 mb-4">{message}</p>
        <button
          onClick={handleGoHome}
          className="bg-primary px-4 py-2 rounded-full shadow-md hover:bg-primary-hover transition duration-200"
        >
          {t('button')}
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
