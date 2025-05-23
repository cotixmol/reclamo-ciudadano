'use client';
import React from 'react';
import '../../i18n';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';

export default function HomePage() {
  const { t } = useTranslation('homepage'); // Use 'homepage' namespace

  return (
    <div className="min-h-screen bg-RCColors-900 text-RCColors-100 p-5 relative">
      {/* Version Info at Top-Left */}
      <div className="flex justify-between items-center">
        <div className="text-xs text-RCColors-400 flex self-start">
          v.{process.env.NEXT_PUBLIC_VERSION}
        </div>

        {/* Language Switcher Container */}
        <div className="flex justify-end items-center">
          <LanguageSwitcher />

          {/* desktop-only Admin button */}
          <Link href="/admin/login" passHref className="hidden md:inline-flex">
            <button
              type="button"
              className="ml-4 px-4 py-2 text-primary text-xs font-semibold hover:text-primary-hover rounded-lg hover:bg-RCColors-700"
            >
              {t('admin.button')}
            </button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
          {t('hero.title')}
        </h1>
        <p className="text-lg md:text-xl text-RCColors-300 mb-8">
          {t('hero.subtitle')}
        </p>
        <Link href="/claims" passHref>
          <button
            type="button"
            className="px-6 py-3 bg-primary text-lg font-semibold rounded-lg shadow-lg hover:bg- RCPink-hover transition-all duration-300"
          >
            {t('hero.button')}
          </button>
        </Link>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="bg-RCColors-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-RCColors-100 mb-4">
            {t('features.reportIssues.title')}
          </h2>
          <p className="text-RCColors-300 text-sm leading-relaxed">
            {t('features.reportIssues.description')}
          </p>
        </div>

        <div className="bg-RCColors-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-RCColors-100 mb-4">
            {t('features.trackProgress.title')}
          </h2>
          <p className="text-RCColors-300 text-sm leading-relaxed">
            {t('features.trackProgress.description')}
          </p>
        </div>

        <div className="bg-RCColors-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-RCColors-100 mb-4">
            {t('features.makeDifference.title')}
          </h2>
          <p className="text-RCColors-300 text-sm leading-relaxed">
            {t('features.makeDifference.description')}
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="my-16 text-center text-sm text-RCColors-500">
        <p>{t('footer.text')}</p>
      </footer>
    </div>
  );
}
