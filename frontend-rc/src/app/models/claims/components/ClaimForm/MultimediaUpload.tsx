// components/MultimediaUpload.tsx
import React from 'react';
import { FiPaperclip } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const MultimediaUpload: React.FC = () => {
  const { t } = useTranslation('claimcreationform');

  return (
    <div>
      <label htmlFor="multimedia" className="block mb-1">
        {t('multimediaUpload')}
      </label>
      <div className="flex items-center bg-gray-700 rounded p-2 focus-within:ring-2 focus-within:ring-primary">
        <input
          id="multimedia"
          type="text"
          placeholder={t('featureComingSoon', 'Feature coming soon')}
          disabled
          className="flex-grow bg-transparent text-gray-400 focus:outline-none"
        />
        <button
          type="button"
          disabled
          className="px-2 py-2 text-sm hover:text-white"
          aria-label="Attach"
        >
          <FiPaperclip />
        </button>
      </div>
    </div>
  );
};

export default MultimediaUpload;
