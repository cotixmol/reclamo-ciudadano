'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiFilter } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { ClaimStatusEnum, PriorityEnum } from '@/app/models/claims/types/claim';

export interface IAdminTableFilters {
  searchTerm: string;
  status: ClaimStatusEnum | 'all';
  priority: PriorityEnum | 'all';
  typeCategoryId: number | 'all';
  dateFrom: string;
  dateTo: string;
  includeDeleted: boolean;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilters: IAdminTableFilters;
  onApplyFilters: (newFilters: IAdminTableFilters) => void;
  allClaimTypes: { value: number; label: string }[];
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  activeFilters,
  onApplyFilters,
  allClaimTypes,
}) => {
  const { t } = useTranslation(['admin', 'claim', 'claimcreationform']);

  // Local status for filters within the modal
  const [localFilters, setLocalFilters] =
    useState<IAdminTableFilters>(activeFilters);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(activeFilters);
    }
  }, [isOpen, activeFilters]);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleIncludeDeletedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters((prev) => ({
      ...prev,
      includeDeleted: e.target.checked,
    }));

    console.log(localFilters);
  };

  const handleSubmitFilters = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClearLocalFilters = () => {
    setLocalFilters({
      searchTerm: '',
      status: 'all',
      priority: 'all',
      typeCategoryId: 'all',
      dateFrom: '',
      dateTo: '',
      includeDeleted: false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-RCColors-900/80 p-4 transition-opacity duration-300">
      <div className="max-w-lg w-full bg-RCColors-800 rounded-lg border-t-4 border-primary shadow-xl">
        <div className="flex justify-between items-center p-5 border-b border-RCColors-700">
          <div className="flex items-center space-x-3">
            <FiFilter className="text-primary w-6 h-6" />
            <h2 className="text-xl font-semibold text-RCColors-100">
              {t('admin:filter', 'Filtrar reclamos')}
            </h2>
          </div>
          <button
            onClick={onClose} // Closes without applying changes
            className="text-RCColors-400 hover:text-RCColors-100 p-1 rounded-full hover:bg-RCColors-700 focus:outline-none focus:ring-2 focus:ring-RCColors-500"
            aria-label={t('admin:close', 'Cerrar')}
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[calc(90vh-160px)] overflow-y-auto">
          <div>
            <label
              htmlFor="searchTermModal"
              className="block text-sm font-medium text-RCColors-200 mb-1.5"
            >
              {t('admin:searchTerm', 'Término de búsqueda')}
            </label>
            <input
              type="text"
              name="searchTerm"
              id="searchTermModal"
              value={localFilters.searchTerm}
              onChange={handleInputChange}
              placeholder={
                t('admin:searchTermPlaceholderShort', 'Título, ID...') || ''
              }
              className="w-full p-2.5 bg-RCColors-700 border border-RCColors-600 text-RCColors-100 rounded-md focus:outline-none focus:border-primary placeholder-RCColors-400 transition-colors duration-150"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="statusModal"
                className="block text-sm font-medium text-RCColors-200 mb-1.5"
              >
                {t('admin:status', 'Estado')}
              </label>
              <select
                name="status"
                id="statusModal"
                value={localFilters.status}
                onChange={handleInputChange}
                className="w-full p-2.5 bg-RCColors-700 border border-RCColors-600 text-RCColors-100 rounded-md focus:outline-none focus:border-primary appearance-none transition-colors duration-150"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem',
                }}
              >
                <option value="all">{t('admin:all', 'Todos')}</option>
                {Object.values(ClaimStatusEnum).map((status) => (
                  <option key={status} value={status}>
                    {t(`claim:status.${status}`, status)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="priorityModal"
                className="block text-sm font-medium text-RCColors-200 mb-1.5"
              >
                {t('admin:priority', 'Prioridad')}
              </label>
              <select
                name="priority"
                id="priorityModal"
                value={localFilters.priority}
                onChange={handleInputChange}
                className="w-full p-2.5 bg-RCColors-700 border border-RCColors-600 text-RCColors-100 rounded-md focus:outline-none focus:border-primary appearance-none transition-colors duration-150"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem',
                }}
              >
                <option value="all">{t('admin:all', 'Todos')}</option>
                {Object.values(PriorityEnum).map((priority) => (
                  <option key={priority} value={priority}>
                    {t(`claimcreationform:priority.${priority}`, priority)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="typeCategoryIdModal"
              className="block text-sm font-medium text-RCColors-200 mb-1.5"
            >
              {t('admin:type', 'Tipo de reclamo')}
            </label>
            <select
              name="typeCategoryId"
              id="typeCategoryIdModal"
              value={localFilters.typeCategoryId}
              onChange={handleInputChange}
              className="w-full p-2.5 bg-RCColors-700 border border-RCColors-600 text-RCColors-100 rounded-md focus:outline-none focus:border-primary appearance-none transition-colors duration-150"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem',
              }}
            >
              <option value="all">{t('admin:all', 'Todos')}</option>
              {allClaimTypes.map((ct) => (
                <option key={ct.value} value={ct.value}>
                  {ct.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="dateFromModal"
                className="block text-sm font-medium text-RCColors-200 mb-1.5"
              >
                {t('admin:dateFrom', 'Desde')}
              </label>
              <input
                type="date"
                name="dateFrom"
                id="dateFromModal"
                value={localFilters.dateFrom}
                onChange={handleInputChange}
                className="w-full p-2.5 bg-RCColors-700 border border-RCColors-600 text-RCColors-100 rounded-md focus:outline-none focus:border-primary [color-scheme:dark] transition-colors duration-150"
              />
            </div>
            <div>
              <label
                htmlFor="dateToModal"
                className="block text-sm font-medium text-RCColors-200 mb-1.5"
              >
                {t('admin:dateTo', 'Hasta')}
              </label>
              <input
                type="date"
                name="dateTo"
                id="dateToModal"
                value={localFilters.dateTo}
                onChange={handleInputChange}
                className="w-full p-2.5 bg-RCColors-700 border border-RCColors-600 text-RCColors-100 rounded-md focus:outline-none focus:border-primary [color-scheme:dark] transition-colors duration-150"
              />
            </div>
          </div>
          <div className="flex items-center pt-2">
            <input
              type="checkbox"
              name="includeDeleted"
              id="includeDeletedModal"
              checked={localFilters.includeDeleted}
              onChange={handleIncludeDeletedChange}
              className="h-4 w-4 text-primary accent-primary bg-RCColors-700 border-RCColors-600 rounded focus:ring-primary focus:ring-offset-RCColors-800"
            />
            <label
              htmlFor="includeDeletedModal"
              className="ml-2 block text-sm text-RCColors-200"
            >
              {t('admin:filter.includeDeleted', 'Incluir reclamos eliminados')}
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 p-5 border-t border-RCColors-700">
          <button
            type="button"
            onClick={handleClearLocalFilters}
            className="px-5 py-2.5 text-sm rounded-md bg-RCColors-700 text-RCColors-100 hover:bg-RCColors-600 focus:outline-none transition-colors duration-200"
          >
            {t('admin:clearFilters', 'Limpiar Filtros')}
          </button>
          <button
            type="button"
            onClick={handleSubmitFilters}
            className="px-6 py-2.5 text-sm font-semibold rounded-md bg-primary text-white hover:bg-opacity-80 focus:outline-none transition-colors duration-200"
          >
            {t('admin:applyFilters', 'Aplicar Filtros')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
