'use client';

import React, { useState, useEffect } from 'react';
import { FiEdit3, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import {
  ClaimStatusEnum,
  ClaimResponse,
} from '@/app/models/claims/types/claim';

interface EditStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentClaim: ClaimResponse | null;
  onSave: (publicId: string, newStatus: ClaimStatusEnum) => void;
}

const EditStatusModal: React.FC<EditStatusModalProps> = ({
  isOpen,
  onClose,
  currentClaim,
  onSave,
}) => {
  const { t } = useTranslation(['admin', 'claim']);
  const [newStatus, setNewStatus] = useState<ClaimStatusEnum>(
    currentClaim?.status || ClaimStatusEnum.Open
  );

  useEffect(() => {
    if (isOpen && currentClaim) {
      setNewStatus(currentClaim.status);
    }
  }, [currentClaim, isOpen]);

  if (!isOpen || !currentClaim) return null;

  const handleSave = () => {
    onSave(currentClaim.publicId, newStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-RCColors-900/80 p-4 transition-opacity duration-300">
      <div className="max-w-md w-full bg-RCColors-800 rounded-lg border-t-4 border-primary shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-RCColors-700">
          <div className="flex items-center space-x-3">
            <FiEdit3 className="text-primary w-6 h-6" />
            <h2 className="text-xl font-semibold text-RCColors-100">
              {t('admin:editStatusTitle', 'Editar estado del reclamo')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-RCColors-400 hover:text-RCColors-100 p-1 rounded-full hover:bg-RCColors-700 focus:outline-none focus:ring-2 focus:ring-RCColors-500"
            aria-label={t('admin:close', 'Cerrar')}
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <p
            className="text-sm text-RCColors-300 truncate"
            title={currentClaim.title}
          >
            {t('admin:title', 'Título')}:{' '}
            <span className="font-medium text-RCColors-200">
              {currentClaim.title}
            </span>
          </p>
          <p className="text-sm text-RCColors-300">
            {t('admin:claimId', 'ID Reclamo')}:{' '}
            <span className="font-medium text-RCColors-200">
              {currentClaim.publicId}
            </span>
          </p>
          <div>
            <label
              htmlFor="statusModalUpdate"
              className="block text-sm font-medium text-RCColors-200 mb-1.5"
            >
              {t('admin:status', 'Nuevo estado')}
            </label>
            <select
              id="statusModalUpdate"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as ClaimStatusEnum)}
              className="w-full p-2.5 bg-RCColors-700 border border-RCColors-600 text-RCColors-100 rounded-md focus:outline-none focus:border-primary appearance-none transition-colors duration-150"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem',
              }}
            >
              {Object.values(ClaimStatusEnum).map((s) => (
                <option key={s} value={s}>
                  {t(`claim:status.${s}`, s)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 p-5 border-t border-RCColors-700">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm rounded-md bg-RCColors-700 text-RCColors-100 hover:bg-RCColors-600 focus:outline-none hover:bg-opacity-80 transition-colors duration-200"
          >
            {t('admin:cancel', 'Cancelar')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 text-sm font-semibold rounded-md bg-primary text-white focus:outline-none hover:bg-opacity-80 transition-colors duration-200"
          >
            {t('admin:save', 'Guardar')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStatusModal;
