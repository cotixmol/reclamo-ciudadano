'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '../../../i18n';
import { useTranslation } from 'react-i18next';
import { ClaimResponse, ClaimStatus } from '../utils/types';

interface ClaimCardProps {
  claim: ClaimResponse;
}

const ClaimCard: React.FC<ClaimCardProps> = ({ claim }) => {
  const { t } = useTranslation('claim');

  const { publicId, title, description, status, createdAt, isEdited } = claim;

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
    <div className="group relative bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out max-h-96 md:max-h-[500px]">
      <div className="relative w-full">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/0/05/Burnout_ops_on_Mangum_Fire_McCall_Smokejumpers.jpg"
          alt={title}
          width={400}
          height={300}
          className="w-full h-full max-h-64 min-h-32 md:max-h-64 object-cover"
        />
        <span
          className={`absolute top-2 right-2 z-10 text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
            status
          )} text-white capitalize`}
        >
          {t(`status.${status}`)}
        </span>
      </div>

      {/* Card Content Section */}
      <div className="p-4 bg-gray-900 text-gray-200">
        <h3 className="text-base font-semibold text-gray-100 truncate">
          {title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-400">
              {formattedDate}{' '}
              <span className="text-gray-500">{formattedTime}</span>
            </span>
            {isEdited && (
              <span className="text-xs font-medium text-yellow-400">
                {t('edited')}
              </span>
            )}
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-400 leading-relaxed line-clamp-3">
          {description}
        </p>
        {/* See More Information */}
        <div className="mt-4">
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
