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
  const { t } = useTranslation('claimcreationform');

  // Find which claim type is selected
  const selectedType = claimTypes.find((ct) => ct.id === selectedClaimTypeId);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleSelect = (newId: number) => {
    onChangeAction(newId);
    setIsOpen(false);
  };

  // Close if user clicks outside
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="mb-2 relative" ref={dropdownRef}>
      <label className="block mb-1"> {t('claimType')}</label>

      <button
        type="button"
        onClick={handleToggle}
        className="w-full p-2 bg-gray-700 rounded 
                   flex justify-between items-center text-left
                   focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {selectedType ? (
          <>
            <span className="font-semibold">{selectedType.category}</span>
            <span className="ml-2 text-sm">{selectedType.description}</span>
          </>
        ) : (
          <span> {t('placeholder.chooseAnOption')}</span>
        )}

        <RiArrowDownSLine
          className={`ml-auto h-6 w-6 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {/* The dropdown menu: only renders if isOpen = true */}
      {isOpen && (
        <div
          className="absolute z-50 mt-1 w-full bg-gray-800 rounded 
                     shadow-lg border-2 border-pink-500
                     max-h-24 overflow-y-auto"
          style={{ maxHeight: '200px' }}
        >
          {claimTypes.map((ct) => {
            const isSelected = selectedClaimTypeId === ct.id;
            return (
              <div
                key={ct.id}
                onClick={() => handleSelect(ct.id)}
                className={`
                  cursor-pointer px-3 py-2 hover:bg-gray-700 
                  ${isSelected ? 'text-primary font-semibold' : ''}
                `}
              >
                <div>{ct.category}</div>
                <div className="text-sm">{ct.description}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
