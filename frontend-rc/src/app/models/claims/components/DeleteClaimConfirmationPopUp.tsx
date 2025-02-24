'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiAlertCircle } from 'react-icons/fi';

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
    <div className="fixed inset-0 flex items-center justify-center bg-RCColors-900/80 z-20">
      {/* Popup Container */}
      <div className="max-w-lg w-full mx-4 p-6 bg-RCColors-800 rounded-lg border-t-4 border-primary text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <FiAlertCircle className="text-primary w-16 h-16" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-4">
          {t('confirmDeletionTitle')}
        </h2>

        {/* Message */}
        <p className="text-RCColors-400 mb-6">{t('confirmDeletionMessage')}</p>

        {/* Buttons */}
        <div className="flex justify-center gap-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-RCColors-700 rounded hover:bg-RCColors-600 transition-colors duration-200"
          >
            {t('cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 font-semibold bg-primary rounded hover:bg- RCPink-hover transition-colors duration-200"
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteClaimConfirmationPopUp;
