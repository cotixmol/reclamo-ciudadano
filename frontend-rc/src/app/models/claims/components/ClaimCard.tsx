'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { TiDelete } from 'react-icons/ti';
import { validate as isUUID } from 'uuid';

import '../../../i18n';
import { deleteClaimByPublicId } from '@/app/services/claims/delete';
import {
  ClaimWithMultimediaResponse,
  ClaimStatusEnum,
  PriorityEnum,
} from '../types/claim';
import DeleteClaimConfirmationPopUp from './DeleteClaimConfirmationPopUp';

interface ClaimCardProps {
  claimData: ClaimWithMultimediaResponse;
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClaimCard: React.FC<ClaimCardProps> = ({ claimData, setIsDeleting }) => {
  const { t } = useTranslation('claim');
  const { claim, multimedia } = claimData;
  const { publicId, title, description, status, priority, createdAt } = claim;

  // Convert multimedia to a format we can handle easily.
  // If no multimedia exists, we'll just keep an empty array.
  const [mediaFiles] = useState(() => {
    if (!multimedia || multimedia.length === 0) {
      return [] as { url: string; fileType: string }[];
    }
    return multimedia.map((m) => ({
      url: m.s3Url,
      fileType: m.fileType,
    }));
  });

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string>('');

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? mediaFiles.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaFiles.length);
  };

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
            )} capitalize flex items-center border-r-2 border-gray-700`}
          >
            {t(`status.${status}`)}
          </span>
          <span
            className={`flex text-xs text-gray-900 font-semibold px-2 ${getPriorityColor(
              priority
            )} capitalize flex items-center border-r-2 border-gray-700`}
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
      <div className="w-full h-0.5 bg-gray-700"></div>

      {/* Middle Section: Carousel or Placeholder */}
      <div className="relative w-full h-48 md:h-64 overflow-hidden">
        {mediaFiles.length > 0 ? (
          <>
            {mediaFiles.map((file, index) => {
              const { url, fileType } = file;
              const isActive = index === currentIndex;
              const isImage = fileType.startsWith('image/');
              const isVideo = fileType.startsWith('video/');

              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  {isImage && (
                    <Image
                      src={url}
                      alt={title}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="w-full h-full"
                    />
                  )}
                  {isVideo && (
                    <video
                      src={url}
                      className="w-full h-full object-cover"
                      controls
                    />
                  )}
                </div>
              );
            })}

            {/* Show next/prev buttons only if we have multiple media files */}
            {mediaFiles.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded z-20 text-2xl"
                  onClick={handlePrev}
                >
                  ‹
                </button>
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded z-20 text-2xl"
                  onClick={handleNext}
                >
                  ›
                </button>
              </>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-500">
            {t('noImageAvailable')}
          </div>
        )}
      </div>

      {/* Divider Below Media */}
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
        {deleteError && (
          <p className="mt-2 text-red-300 text-sm">{deleteError}</p>
        )}
      </div>
    </div>
  );
};

export default ClaimCard;
