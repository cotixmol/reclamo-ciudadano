// components/SubmitButton.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

interface SubmitButtonProps {
  disabled: boolean;
  isSubmitting: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  disabled,
  isSubmitting,
}) => {
  const { t } = useTranslation('claimcreationform');

  return (
    <button
      type="submit"
      disabled={disabled || isSubmitting}
      className={`w-full py-2 px-4 rounded transition ${
        disabled || isSubmitting
          ? 'bg-gray-600 cursor-not-allowed'
          : 'bg-primary hover:bg-primary-hover'
      }`}
    >
      {t('claimSubmitButton')}
    </button>
  );
};

export default SubmitButton;
