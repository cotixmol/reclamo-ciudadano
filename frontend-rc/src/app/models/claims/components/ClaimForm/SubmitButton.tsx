import React from 'react';
import { useTranslation } from 'react-i18next';

interface SubmitButtonProps {
  isSubmitting: boolean;
  locationError: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  locationError,
}) => {
  const { t } = useTranslation('claimcreationform');
  const disabled = isSubmitting || locationError;

  return (
    <div>
      {locationError && (
        <p className="text-red-400 text-sm mb-2">
          {t('missingLocationTooltip')}
        </p>
      )}
      <button
        type="submit"
        disabled={disabled}
        className={`w-full py-2 rounded transition ${
          disabled
            ? 'bg-gray-700 cursor-not-allowed'
            : 'bg-primary hover:bg-primary-hover'
        }`}
      >
        {t('claimSubmitButton')}
      </button>
    </div>
  );
};

export default SubmitButton;
