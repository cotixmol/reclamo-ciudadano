'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { TiDelete } from 'react-icons/ti';
import { validate as isUUID } from 'uuid'; // <--- For UUID validation

import '../../../i18n';
import { deleteClaimByPublicId } from '@/app/services/claims/delete';
import { ClaimResponse, ClaimStatus } from '../types/claim';
import DeleteClaimConfirmationPopUp from './DeleteClaimConfirmationPopUp';

interface ClaimCardProps {
  claim: ClaimResponse;
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
  imageUrl: string;
}

const ClaimCard: React.FC<ClaimCardProps> = ({
  claim,
  setIsDeleting,
  imageUrl,
}) => {
  const { t } = useTranslation('claim');
  const { publicId, title, description, status, createdAt } = claim;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string>('');

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handleDeleteConfirmed = async () => {
    setIsDeleting(true);
    closePopup();
    if (!isUUID(publicId)) {
      setDeleteError('Invalid or missing Claim ID');
      setIsDeleting(false);
      return;
    }

    try {
      await deleteClaimByPublicId(publicId);
      window.location.reload();
    } catch (error) {
      const msg = (error as Error).message || 'Deletion failed';
      setDeleteError(msg);
      setIsDeleting(false);
    }
  };

  const formattedDate =
    createdAt && !isNaN(new Date(createdAt).getTime())
      ? new Date(createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : t('unknownDate');

  const formattedTime =
    createdAt && !isNaN(new Date(createdAt).getTime())
      ? new Date(createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : t('unknownTime');

  const getStatusColor = (status: ClaimStatus) => {
    switch (status) {
      case ClaimStatus.Open:
        return 'bg-blue-400';
      case ClaimStatus.Close:
        return 'bg-red-400';
      default:
        return 'bg-green-400';
    }
  };

  return (
    <div className="group relative bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out md:max-h-[500px]">
      {/* Confirmation Popup */}
      <DeleteClaimConfirmationPopUp
        isOpen={isPopupOpen}
        onClose={closePopup}
        onConfirm={handleDeleteConfirmed}
      />

      <div className="relative w-full">
        {/* Delete Button */}
        <div className="absolute top-2 right-2">
          <div className="absolute inset-0 w-7 h-7 bg-gray-800 rounded-full"></div>
          <button
            onClick={openPopup}
            aria-label="Delete Claim"
            className="relative p-0.5 z-10"
          >
            <TiDelete className="w-6 h-6 text-primary hover:text-primary-hover transition-colors duration-200" />
          </button>
        </div>

        {/* Image */}
        <Image
          src={imageUrl}
          alt={title}
          width={400}
          height={300}
          className="w-full h-full max-h-64 min-h-32 md:max-h-64 object-cover"
        />

        {/* Status Tag */}
        <span
          className={`absolute top-2 left-2 z-10 text-xs font-semibold px-3 py-1 mt-1 rounded-full ${getStatusColor(
            status
          )} capitalize`}
        >
          {t(`status.${status}`)}
        </span>
      </div>

      {/* Card Content Section */}
      <div className="p-4 bg-gray-800 text-gray-200">
        <h3 className="text-base font-semibold text-gray-100 whitespace-normal">
          {title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-400">
              {formattedDate}{' '}
              <span className="text-gray-500">{formattedTime}</span>
            </span>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-400 leading-relaxed line-clamp-3">
          {description}
        </p>
        <div className="my-2">
          <Link href={`/models/claims/pages/${publicId}`}>
            <button className="relative z-10 text-sm font-semibold text-primary hover:underline hover:text-primary-hover transition duration-200">
              {t('seeMore')}
            </button>
          </Link>
        </div>

        {/* 5) Show an inline error if present */}
        {deleteError && (
          <p className="mt-2 text-red-500 text-sm">{deleteError}</p>
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
    </div>
  );
};

export default ClaimCard;
