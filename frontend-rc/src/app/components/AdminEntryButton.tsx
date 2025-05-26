// src/components/AdminEntryButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import React from 'react';

export default function AdminEntryButton() {
  const router = useRouter();
  const { t } = useTranslation('homepage');

  const handleClick = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/login/check`,
        { method: 'GET' }
      );
      if (res.ok) {
        // logged in
        router.push(`/admin`);
      } else {
        // not logged in
        router.push('/login');
      }
    } catch {
      // network error or other
      router.push('/login');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="hidden md:inline-flex ml-4 px-4 py-2 text-primary text-xs font-semibold hover:text-primary-hover rounded-lg hover:bg-RCColors-700"
    >
      {t('admin.button')}
    </button>
  );
}
