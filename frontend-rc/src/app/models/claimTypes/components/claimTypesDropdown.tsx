'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';
import { useClaimTypes } from '@/app/context/ClaimTypesContext';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

interface ClaimTypesDropdownProps {
  selectedClaimTypeId: number | null;
  onChangeAction: (newId: number) => void;
}

export default function ClaimTypesDropdown({
  selectedClaimTypeId,
  onChangeAction,
}: ClaimTypesDropdownProps) {
  const claimTypes = useClaimTypes();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { i18n, t } = useTranslation('claimcreationform');

  // Find which claim type is selected
  const selectedType = claimTypes.find((ct) => ct.id === selectedClaimTypeId);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleSelect = (newId: number) => {
    onChangeAction(newId);
    setIsOpen(false);
  };

  // Close the dropdown if the user clicks outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="mb-2 relative" ref={dropdownRef}>
      <label className="block mb-1"> {t('claimType')}</label>
      <button
        type="button"
        onClick={handleToggle}
        className="w-full p-2 bg-gray-700 rounded flex justify-between items-center text-left focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {selectedType ? (
          <>
            {/* Use the current language to decide which fields to display */}
            <span className="font-semibold">
              {i18n.language === 'es'
                ? selectedType.category_es
                : selectedType.category_en}
            </span>
            <span className="ml-2 text-sm">
              {i18n.language === 'es'
                ? selectedType.description_es
                : selectedType.description_en}
            </span>
          </>
        ) : (
          <span>{t('placeholder.chooseAnOption')}</span>
        )}
        <RiArrowDownSLine
          className={`ml-auto h-6 w-6 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div
          className="absolute z-50 mt-1 w-full bg-gray-800 rounded shadow-lg border-2 border-gray-500 max-h-28 overflow-y-auto"
          style={{ maxHeight: '200px' }}
        >
          {claimTypes.map((ct) => {
            const isSelected = selectedClaimTypeId === ct.id;
            const displayCategory =
              i18n.language === 'es' ? ct.category_es : ct.category_en;
            const displayDescription =
              i18n.language === 'es' ? ct.description_es : ct.description_en;
            return (
              <div
                key={ct.id}
                onClick={() => handleSelect(ct.id)}
                className={`cursor-pointer px-3 py-2 hover:bg-gray-700 ${isSelected ? 'text-primary font-semibold' : ''}`}
              >
                <div>{displayCategory}</div>
                <div className="text-sm">{displayDescription}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
