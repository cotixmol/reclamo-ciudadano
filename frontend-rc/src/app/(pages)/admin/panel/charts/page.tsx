'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import '@/app/i18n';

export default function AdminTablePage() {
  const { t } = useTranslation('admin');
  return (
    <div>
      <h1 className="text-2xl font-semibold text-RCColors-100 mb-6">
        {t('graphs', 'Gráficos')}
      </h1>
      <p className="text-RCColors-300">Contenido de gráficos...</p>
    </div>
  );
}
