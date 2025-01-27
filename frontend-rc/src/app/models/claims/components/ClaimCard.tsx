'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { TiDelete } from 'react-icons/ti';
import { validate as isUUID } from 'uuid';

import '../../../i18n';
import { deleteClaimByPublicId } from '@/app/services/claims/delete';
import { ClaimResponse, ClaimStatusEnum, PriorityEnum } from '../types/claim';
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
  const { publicId, title, description, status, priority, createdAt } = claim;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string>('');

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handleDeleteConfirmed = async () => {
    setIsDeleting(true);
    closePopup();
    if (!isUUID(publicId)) {
      setDeleteError(t('invalidClaimId'));
      setIsDeleting(false);
      return;
    }

    try {
      await deleteClaimByPublicId(publicId);
      // Instead of reloading the page, you might want to handle state updates here
      window.location.reload();
    } catch (error) {
      const msg = (error as Error).message || t('deletionFailed');
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
  const getStatusColor = (status: ClaimStatusEnum) => {
    switch (status) {
      case ClaimStatusEnum.Open:
        return 'bg-blue-400';
      case ClaimStatusEnum.Close:
        return 'bg-red-400';
      default:
        return 'bg-green-400';
    }
  };

  const getPriorityColor = (priority: PriorityEnum) => {
    switch (priority) {
      case PriorityEnum.LOW:
        return 'bg-green-400';
      case PriorityEnum.MEDIUM:
        return 'bg-yellow-400';
      case PriorityEnum.HIGH:
        return 'bg-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="flex flex-col border-2 border-gray-700 bg-gray-800 rounded-lg overflow-hidden">
      {/* Confirmation Popup */}
      <DeleteClaimConfirmationPopUp
        isOpen={isPopupOpen}
        onClose={closePopup}
        onConfirm={handleDeleteConfirmed}
      />

      {/* Top Section: Status Tag, Priority Tag, and Delete Button */}
      <div className="flex justify-between items-center">
        <div className="flex h-full">
          <span
            className={`flex text-xs text-gray-900 font-semibold px-2 rounded-tl-lg ${getStatusColor(
              status
            )} capitalize flex items-center font-semibold border-r-2 border-gray-700`}
          >
            {t(`status.${status}`)}
          </span>

          <span
            className={`flex text-xs text-gray-900 font-semibold px-2 ${getPriorityColor(
              priority
            )} capitalize flex items-center font-semibold border-r-2 border-gray-700`}
          >
            {t(`priority.${priority}`)}
          </span>
        </div>
        <div>
          <button
            onClick={openPopup}
            aria-label={t('deleteClaim')} // Ensure this key exists in your translation files
            className="rounded-tr-lg transition-colors duration-200 flex items-center justify-center p-1"
          >
            <TiDelete className="w-6 h-6 transition-colors duration-200" />
          </button>
        </div>
      </div>

      {/* Pink Line Above Image */}
      <div className="w-full h-0.5 bg-gray-700"></div>

      {/* Middle Section: Image */}
      <div className="w-full h-48 md:h-64 relative">
        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Pink Line Below Image */}
      <div className="w-full h-0.5 bg-primary"></div>

      {/* Bottom Section: Information */}
      <div className="p-4 bg-gray-800 text-gray-200 flex flex-col flex-grow">
        <h3 className="text-base font-semibold whitespace-normal">{title}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-400">
            {formattedDate}{' '}
            <span className="text-gray-500">{formattedTime}</span>
          </span>
        </div>
        <p className="mt-2 text-xs text-gray-400 leading-relaxed line-clamp-3">
          {description}
        </p>
        <div className="mt-auto">
          <Link href={`/models/claims/pages/${publicId}`}>
            <button className="text-sm pt-4 font-semibold text-primary hover:underline hover:text-primary-hover transition duration-200">
              {t('seeMore')}
            </button>
          </Link>
        </div>

        {/* Show an inline error if present */}
        {deleteError && (
          <p className="mt-2 text-red-300 text-sm">{deleteError}</p>
        )}
      </div>
    </div>
  );
};

export default ClaimCard;
