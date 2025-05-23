'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { TiDelete } from 'react-icons/ti';
import { validate as isUUID } from 'uuid';

import '../../../i18n';
import { deleteClaimByPublicId } from '@/app/services/claims/delete';
import { ClaimWithMultimediaResponse } from '../types/claim';
import DeleteClaimConfirmationPopUp from './DeleteClaimConfirmationPopUp';
import Carousel, { MediaFile } from '@/app/components/Carousel';
import { getStatusColor, getPriorityColor } from '@/app/utils/claimColors';

interface ClaimCardProps {
  claimData: ClaimWithMultimediaResponse;
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClaimCard: React.FC<ClaimCardProps> = ({ claimData, setIsDeleting }) => {
  const { t } = useTranslation('claim');
  const { claim, multimedia } = claimData;
  const { publicId, title, description, status, priority, createdAt } = claim;

  // Prepare media files for the Carousel component
  const mediaFiles: MediaFile[] =
    multimedia && multimedia.length > 0
      ? multimedia.map((m) => ({
          url: m.s3Url,
          fileType: m.fileType,
        }))
      : [];

  // Popup state
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

  return (
    <div className="flex flex-col border-2 border-RCColors-700 bg-RCColors-800 rounded-lg overflow-hidden">
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
            className={`flex text-xs text-RCColors-900 font-semibold px-2 rounded-tl-lg ${getStatusColor(
              status
            )} capitalize flex items-center border-r-2 border-RCColors-700`}
          >
            {t(`status.${status}`)}
          </span>
          <span
            className={`flex text-xs text-RCColors-900 font-semibold px-2 ${getPriorityColor(
              priority
            )} capitalize flex items-center border-r-2 border-RCColors-700`}
          >
            {t(`priority.${priority}`)}
          </span>
        </div>
        <button
          onClick={openPopup}
          aria-label={t('deleteClaim')}
          className="rounded-tr-lg transition-colors duration-200 flex items-center justify-center p-1"
        >
          <TiDelete className="w-6 h-6 transition-colors duration-200" />
        </button>
      </div>

      {/* Divider Above Media */}
      <div className="w-full h-0.5 bg-RCColors-700"></div>

      {/* Carousel Section using the reusable Carousel component */}
      <div className="relative w-full h-48 md:h-64 overflow-hidden">
        {mediaFiles.length > 0 ? (
          <Carousel
            mediaFiles={mediaFiles}
            containerClassName="w-full h-full"
            imageClassName="w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-RCColors-500">
            {t('noImageAvailable')}
          </div>
        )}
      </div>

      {/* Divider Below Media */}
      <div className="w-full h-0.5 bg-primary"></div>

      {/* Bottom Section: Information */}
      <div className="p-4 bg-RCColors-800 text-RCColors-200 flex flex-col flex-grow">
        <h3 className="text-base font-semibold whitespace-normal">{title}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-RCColors-400">
            {formattedDate}{' '}
            <span className="text-RCColors-500">{formattedTime}</span>
          </span>
        </div>
        <p className="mt-2 text-xs text-RCColors-400 leading-relaxed line-clamp-3">
          {description}
        </p>
        <div className="mt-auto">
          <Link href={`/claims/${publicId}`}>
            <button className="text-sm pt-4 font-semibold text-primary hover:underline hover:text- RCPink-hover transition duration-200">
              {t('seeMore')}
            </button>
          </Link>
        </div>
        {deleteError && (
          <p className="mt-2 text-red-300 text-sm">{deleteError}</p>
        )}
      </div>
    </div>
  );
};

export default ClaimCard;
