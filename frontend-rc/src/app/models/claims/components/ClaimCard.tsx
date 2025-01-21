'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '../../../i18n';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClaimResponse, ClaimStatus } from '../types/claim';
import { TiDelete } from 'react-icons/ti';
import { deleteClaimByPublicId } from '@/app/services/claims/delete';
import DeleteClaimConfirmationPopUp from './DeleteClaimConfirmationPopUp';

interface ClaimCardProps {
  claim: ClaimResponse;
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClaimCard: React.FC<ClaimCardProps> = ({ claim, setIsDeleting }) => {
  const { t } = useTranslation('claim');
  const { publicId, title, description, status, createdAt } = claim;
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handleDeleteConfirmed = async () => {
    setIsDeleting(true);
    closePopup();
    try {
      await deleteClaimByPublicId(publicId);
      // Instead of window.location.reload(), consider updating parent's state or re-fetching data
      window.location.reload();
    } catch (error) {
      console.error('Deletion failed', error);
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
        {/* Container for Quarter Circle and Delete Button */}
        <div className="absolute top-2 right-2">
          <div className="absolute inset-0 w-7 h-7 bg-gray-800 rounded-full"></div>
          {/* Delete Button opens the confirmation pop-up */}
          <button
            onClick={openPopup}
            aria-label="Delete Claim"
            className="relative p-0.5 z-10"
          >
            <TiDelete className="w-6 h-6 text-primary hover:text-primary-hover transition-colors duration-200" />
          </button>
        </div>

        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/0/05/Burnout_ops_on_Mangum_Fire_McCall_Smokejumpers.jpg"
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
        {/* See More Information */}
        <div className="my-2">
          <Link href={`/models/claims/pages/${publicId}`}>
            <button className="relative z-10 text-sm font-semibold text-primary hover:underline hover:text-primary-hover transition duration-200">
              {t('seeMore')}
            </button>
          </Link>
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
    </div>
  );
};

export default ClaimCard;
