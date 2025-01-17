'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

interface DeleteClaimConfirmationPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteClaimConfirmationPopUp: React.FC<
  DeleteClaimConfirmationPopUpProps
> = ({ isOpen, onClose, onConfirm }) => {
  const { t } = useTranslation('claim');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/80 z-20">
      <div className="bg-gray-800 rounded-lg p-8">
        <h2 className="flex justify-center text-2xl font-semibold mb-4">
          {t('confirmDeletionTitle')}
        </h2>
        <p className="mb-6">{t('confirmDeletionMessage')}</p>
        <div className="flex justify-center gap-10">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-500 transition-colors duration-200"
          >
            {t('cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 font-semibold bg-primary rounded hover:bg-primary-hover transition-colors duration-200"
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteClaimConfirmationPopUp;
