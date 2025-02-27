// components/DescriptionInput.tsx
import React from 'react';
import { TiDelete } from 'react-icons/ti';
import { useTranslation } from 'react-i18next';

interface DescriptionInputProps {
  description: string;
  setDescription: (description: string) => void;
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({
  description,
  setDescription,
}) => {
  const { t } = useTranslation('claimcreationform');

  return (
    <div>
      <label htmlFor="description" className="block mb-1">
        {t('claimDescription')}
      </label>
      <div className="flex items-start bg-RCColors-700 rounded focus-within:ring-2 focus-within:ring-primary">
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          maxLength={1000}
          className="flex-grow p-2 bg-transparent   focus:outline-none resize-none"
          rows={7}
        />
        <button
          type="button"
          onClick={() => setDescription('')}
          className="px-2 py-2 self-start text-sm hover: "
          aria-label="Clear Description"
        >
          <TiDelete className="w-6 h-6" />
        </button>
      </div>
      <p className="text-xs text-RCColors-500 mt-1">
        {description.length} {t('1000characters')}
      </p>
    </div>
  );
};

export default DescriptionInput;
