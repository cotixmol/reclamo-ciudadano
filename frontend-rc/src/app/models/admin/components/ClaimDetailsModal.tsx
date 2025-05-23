'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  FiX,
  FiFileText,
  FiCalendar,
  FiMapPin,
  FiAlertTriangle,
  FiCheckCircle,
  FiType,
  FiTag,
  FiLoader,
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import {
  ClaimWithMultimediaResponse,
  ClaimResponse,
  ClaimStatusEnum,
  PriorityEnum,
  MultimediaMetadataResponse,
} from '@/app/models/claims/types/claim';
import { getStatusColor, getPriorityColor } from '@/app/utils/claimColors';
import { useClaimTypes } from '@/app/context/ClaimTypesContext';
import { RawClaimTypesResponse } from '@/app/models/claimTypes/types/claimTypes';
import { fetchClaimByPublicId } from '@/app/services/claims/fetch';
import ModalCarousel, {
  CarouselMediaItem,
} from '@/app/components/CarouselModal';

const StaticMapDisplay = dynamic(() => import('./StaticMapDisplay'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-RCColors-700 rounded-lg flex items-center justify-center text-RCColors-400">
      <FiLoader className="animate-spin w-8 h-8" />
    </div>
  ),
});

interface ClaimDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialClaimData: Pick<ClaimResponse, 'publicId' | 'title'>;
}

const ClaimDetailsModal: React.FC<ClaimDetailsModalProps> = ({
  isOpen,
  onClose,
  initialClaimData,
}) => {
  const { t, i18n } = useTranslation(['admin', 'claim', 'claimcreationform']);
  const allClaimTypes = useClaimTypes();

  const [fullClaimData, setFullClaimData] =
    useState<ClaimWithMultimediaResponse | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && initialClaimData?.publicId) {
      const loadClaimDetails = async () => {
        setIsLoadingDetails(true);
        setDetailsError(null);
        setFullClaimData(null);
        try {
          const fetchedClaimData = await fetchClaimByPublicId(
            initialClaimData.publicId
          );
          setFullClaimData(fetchedClaimData);
        } catch (error: any) {
          console.error('Error fetching full claim details:', error);
          setDetailsError(
            error.message ||
              t(
                'admin:errorFetchingClaimDetails',
                'Error al cargar detalles del reclamo.'
              )
          );
        } finally {
          setIsLoadingDetails(false);
        }
      };
      loadClaimDetails();
    } else {
      setFullClaimData(null);
      setIsLoadingDetails(false);
      setDetailsError(null);
    }
  }, [isOpen, initialClaimData?.publicId, t]);

  if (!isOpen) return null;

  const getClaimTypeName = (typeId: number | undefined) => {
    if (typeId === undefined || !allClaimTypes)
      return t('admin:unknown', 'Desconocido');
    const claimType = allClaimTypes.find(
      (ct: RawClaimTypesResponse) => ct.id === typeId
    );
    return claimType
      ? i18n.language === 'es'
        ? claimType.categoryEs
        : claimType.categoryEn
      : t('admin:unknown', 'Desconocido');
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString(i18n.language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const renderContent = () => {
    if (isLoadingDetails) {
      return (
        <div className="p-10 flex flex-col items-center justify-center min-h-[300px]">
          <FiLoader className="animate-spin text-primary w-12 h-12 mb-4" />
          <p className="text-RCColors-300">
            {t('admin:loadingDetails', 'Cargando detalles...')}
          </p>
        </div>
      );
    }

    if (detailsError) {
      return (
        <div className="p-10 flex flex-col items-center justify-center min-h-[300px] text-center">
          <FiAlertTriangle className="text-red-500 w-12 h-12 mb-4" />
          <p className="text-RCColors-200 mb-2">{t('admin:error', 'Error')}</p>
          <p className="text-RCColors-300 text-sm">{detailsError}</p>
        </div>
      );
    }

    if (!fullClaimData) {
      return (
        <div className="p-10 flex flex-col items-center justify-center min-h-[300px]">
          <p className="text-RCColors-300">
            {t(
              'admin:noDetailsAvailable',
              'No hay detalles disponibles para este reclamo o se están cargando.'
            )}
          </p>
        </div>
      );
    }

    const { claim, multimedia } = fullClaimData;

    const statusIcon =
      claim.status === ClaimStatusEnum.Open ? (
        <FiAlertTriangle
          className={`mr-1.5 ${getStatusColor(claim.status).replace('bg-', 'text-')}`}
        />
      ) : (
        <FiCheckCircle
          className={`mr-1.5 ${getStatusColor(claim.status).replace('bg-', 'text-')}`}
        />
      );

    const priorityColors = {
      [PriorityEnum.LOW]: 'text-blue-400',
      [PriorityEnum.MEDIUM]: 'text-yellow-400',
      [PriorityEnum.HIGH]: 'text-red-500',
    };

    const carouselMediaItems: CarouselMediaItem[] = (multimedia || []).map(
      (m: MultimediaMetadataResponse) => ({
        src: m.s3Url,
        alt: m.fileName,
        fileType: m.fileType || 'application/octet-stream',
      })
    );

    return (
      <>
        <div className="p-5 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Contenedor scrollable */}
          <h3 className="text-lg font-semibold text-RCColors-50 leading-tight">
            {claim.title}
          </h3>
          <p className="text-sm text-RCColors-300 whitespace-pre-wrap">
            {claim.description}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-3 border-t border-RCColors-700/50">
            <div>
              <p className="text-xs text-RCColors-400 uppercase tracking-wider">
                {t('admin:claimId', 'ID Reclamo')}
              </p>
              <p className="text-sm text-RCColors-100 font-mono break-all">
                {claim.publicId}
              </p>
            </div>
            <div>
              <p className="text-xs text-RCColors-400 uppercase tracking-wider flex items-center">
                <FiType className="mr-1.5 w-3 h-3" />
                {t('admin:type', 'Tipo')}
              </p>
              <p className="text-sm text-RCColors-100">
                {getClaimTypeName(claim.typeCategoryId)}
              </p>
            </div>
            <div>
              <p className="text-xs text-RCColors-400 uppercase tracking-wider flex items-center">
                {statusIcon}
                {t('admin:status', 'Estado')}
              </p>
              <span
                className={`inline-block rounded-full text-xs font-semibold ${getStatusColor(claim.status).replace('bg-', 'text-')} ${getStatusColor(claim.status).replace('400', '100')} bg-opacity-20`}
              >
                {t(`claim:status.${claim.status}`, claim.status)}
              </span>
            </div>
            <div>
              <p className="text-xs text-RCColors-400 uppercase tracking-wider flex items-center">
                <FiTag
                  className={`mr-1.5 w-3 h-3 ${priorityColors[claim.priority]}`}
                />
                {t('admin:priority', 'Prioridad')}
              </p>
              <span
                className={`inline-block rounded-full text-xs font-semibold ${getPriorityColor(claim.priority).replace('bg-', 'text-')} ${getPriorityColor(claim.priority).replace('400', '100')} bg-opacity-20`}
              >
                {t(
                  `claimcreationform:priority.${claim.priority}`,
                  claim.priority
                )}
              </span>
            </div>
            <div>
              <p className="text-xs text-RCColors-400 uppercase tracking-wider flex items-center">
                <FiCalendar className="mr-1.5 w-3 h-3" />
                {t('admin:creationDate', 'Fecha de creación')}
              </p>
              <p className="text-sm text-RCColors-100">
                {formatDate(claim.createdAt)}
              </p>
            </div>
            {(claim as any).address && (
              <div>
                <p className="text-xs text-RCColors-400 uppercase tracking-wider flex items-center">
                  <FiMapPin className="mr-1.5 w-3 h-3" />
                  {t('admin:address', 'Dirección')}
                </p>
                <p className="text-sm text-RCColors-100">
                  {(claim as any).address}
                </p>
              </div>
            )}
          </div>
          {claim.claimLocation?.coordinates && (
            <div className="pt-4 mt-1 border-t border-RCColors-700/50">
              <h4 className="text-md font-semibold text-RCColors-100 mb-2.5">
                {t('admin:locationOnMap', 'Ubicación en el mapa')}
              </h4>
              <StaticMapDisplay
                latitude={claim.claimLocation.coordinates[1]}
                longitude={claim.claimLocation.coordinates[0]}
                address={(claim as any).address}
              />
            </div>
          )}
          {carouselMediaItems && carouselMediaItems.length > 0 && (
            <div className="pt-4 mt-1 border-t border-RCColors-700/50">
              <h4 className="text-md font-semibold text-RCColors-100 mb-2.5">
                {t('admin:multimedia', 'Multimedia')}
              </h4>
              <ModalCarousel
                mediaFiles={carouselMediaItems}
                carouselHeight="h-72"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-4 p-5 border-t border-RCColors-700">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium rounded-md bg-RCColors-700 text-RCColors-100 hover:bg-RCColors-600 focus:outline-none hover:bg-opacity-80 transition-colors duration-200"
          >
            {t('admin:close', 'Cerrar')}
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-RCColors-900/80 p-4 transition-opacity duration-300">
      <div className="max-w-2xl w-full bg-RCColors-800 rounded-lg border-t-4 border-primary shadow-xl flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-RCColors-700">
          <div className="flex items-center space-x-3">
            <FiFileText className="text-primary w-6 h-6" />
            <h2
              className="text-xl font-semibold text-RCColors-100 truncate pr-2"
              title={
                initialClaimData?.title ||
                t('admin:claimDetailsTitle', 'Detalles del reclamo')
              }
            >
              {isLoadingDetails
                ? t('admin:loadingDetails', 'Cargando...')
                : fullClaimData?.claim.title ||
                  initialClaimData?.title ||
                  t('admin:claimDetailsTitle', 'Detalles del reclamo')}
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
        {renderContent()}
      </div>
    </div>
  );
};

export default ClaimDetailsModal;
