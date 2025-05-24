'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import { fetchAllClaimsByClientId } from '@/app/services/admin/claims/fetch';
import { ClaimWithMultimediaResponse } from '@/app/models/claims/types/claim';
import LoadingScreen from '@/app/components/LoadingScreen';
import { useClaimTypes } from '@/app/context/ClaimTypesContext';
import { RawClaimTypesResponse } from '@/app/models/claimTypes/types/claimTypes';
import { FiAlertTriangle, FiMapPin, FiLoader } from 'react-icons/fi';
import ClaimDetailsModal from '@/app/models/admin/components/ClaimDetailsModal';

const ClaimsDisplayMapWithNoSSR = dynamic(
  () => import('@/app/models/admin/components/AdminClaimsDisplayMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[calc(100vh-250px)] min-h-[400px] rounded-lg bg-RCColors-800 flex items-center justify-center">
        <FiLoader className="animate-spin text-primary w-12 h-12" />
      </div>
    ),
  }
);

export default function AdminMapTabPage() {
  const { t, i18n } = useTranslation(['admin', 'claim', 'claimcreationform']);

  const [claims, setClaims] = useState<ClaimWithMultimediaResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClaimForModal, setSelectedClaimForModal] =
    useState<ClaimWithMultimediaResponse | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const allClaimTypesFromContext = useClaimTypes();

  const clientPublicId = process.env.NEXT_PUBLIC_CLIENT_PUBLIC_ID;

  const claimTypesForMap = useMemo(() => {
    return (allClaimTypesFromContext || []).map(
      (ct: RawClaimTypesResponse) => ({
        value: ct.id,
        label: i18n.language === 'es' ? ct.categoryEs : ct.categoryEn,
      })
    );
  }, [allClaimTypesFromContext, i18n.language]);

  const loadClaims = useCallback(async () => {
    if (!clientPublicId) {
      setError(
        t(
          'admin:missingClientPublicId',
          'Falta el ID público del cliente para cargar los reclamos.'
        )
      );
      setIsLoading(false);
      setClaims([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const claimsData = await fetchAllClaimsByClientId(clientPublicId);
      setClaims(claimsData);
    } catch (err: any) {
      console.error('Error fetching claims for map:', err);
      setError(
        err.message ||
          t('admin:errorFetchingClaims', 'Error al obtener los reclamos.')
      );
      setClaims([]);
    } finally {
      setIsLoading(false);
    }
  }, [clientPublicId, t]);

  useEffect(() => {
    loadClaims();
  }, [loadClaims]);

  const handleMarkerClick = (claimData: ClaimWithMultimediaResponse) => {
    setSelectedClaimForModal(claimData);
    setIsDetailsModalOpen(true);
  };

  const initialMapCenter: [number, number] = useMemo(() => {
    const DEFAULT_CENTER: [number, number] = [-34.6037, -58.3816];

    if (claims.length > 0) {
      let sumLat = 0;
      let sumLng = 0;
      let validCoordsCount = 0;

      claims.forEach((c) => {
        const coords = c.claim.claimLocation?.coordinates;
        if (
          coords &&
          typeof coords[0] === 'number' &&
          typeof coords[1] === 'number' &&
          !isNaN(coords[0]) &&
          !isNaN(coords[1])
        ) {
          sumLng += coords[0];
          sumLat += coords[1];
          validCoordsCount++;
        }
      });

      if (validCoordsCount > 0) {
        return [sumLat / validCoordsCount, sumLng / validCoordsCount];
      }
    }
    return DEFAULT_CENTER;
  }, [claims]);

  if (isLoading && claims.length === 0 && !error) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-5 h-full flex flex-col bg-RCColors-900 text-RCColors-100">
      <h1 className="text-2xl font-semibold text-RCColors-50 shrink-0">
        {t('admin:map.title', 'Mapa de reclamos')}
      </h1>
      <div className="flex-grow relative rounded-lg shadow-md min-h-[450px]">
        {!isLoading && error && claims.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center bg-RCColors-800 rounded-lg p-8 text-center">
            <FiAlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <p className="text-RCColors-200 text-lg mb-2">{error}</p>
            <p className="text-RCColors-400 text-sm">
              {t(
                'admin:map.errorDetails',
                'No se pudieron cargar los reclamos para el mapa.'
              )}
            </p>
          </div>
        )}
        {!isLoading && !error && claims.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center bg-RCColors-800 rounded-lg p-8 text-center">
            <FiMapPin className="w-16 h-16 text-RCColors-600 mb-4" />
            <h2 className="text-2xl font-semibold mb-3 text-RCColors-200">
              {t('admin:noClaimsFoundTitle', 'Aún no hay reclamos')}
            </h2>
            <p className="text-RCColors-300 text-lg">
              {t(
                'admin:map.noClaimsFoundMap',
                'No hay reclamos para mostrar en el mapa.'
              )}
            </p>
            <p className="text-xs text-RCColors-400 mt-1">
              {clientPublicId === '5474008e-22ce-4f18-a60e-cec2bda3e354'
                ? t('admin:map.usingMockId', '(Usando ID de cliente de prueba)')
                : ''}
            </p>
          </div>
        )}
        {(claims.length > 0 || isLoading) && !error && (
          <ClaimsDisplayMapWithNoSSR
            claims={claims}
            onMarkerClick={handleMarkerClick}
            mapCenter={initialMapCenter}
            allClaimTypes={claimTypesForMap}
          />
        )}
      </div>

      {isDetailsModalOpen && selectedClaimForModal && (
        <ClaimDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          initialClaimData={{
            publicId: selectedClaimForModal.claim.publicId,
            title: selectedClaimForModal.claim.title,
          }}
        />
      )}
    </div>
  );
}
