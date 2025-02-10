// components/TitleInput.tsx
import React from 'react';
import { TiDelete } from 'react-icons/ti';
import { useTranslation } from 'react-i18next';

interface TitleInputProps {
  title: string;
  setTitle: (title: string) => void;
}

const TitleInput: React.FC<TitleInputProps> = ({ title, setTitle }) => {
  const { t } = useTranslation('claimcreationform');

  return (
    <div>
      <label htmlFor="title" className="block mb-1">
        {t('claimTitle')}
      </label>
      <div className="flex items-start bg-gray-700 rounded focus-within:ring-2 focus-within:ring-primary">
        <input
          id="title"
          type="text"
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
          aria-label="Clear Title"
        >
          <TiDelete className="w-6 h-6" />
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {title.length} {t('200characters')}
      </p>
    </div>
  );
};

export default TitleInput;
