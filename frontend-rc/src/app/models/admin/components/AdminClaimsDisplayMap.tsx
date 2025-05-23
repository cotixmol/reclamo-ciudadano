'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  ClaimWithMultimediaResponse,
  ClaimStatusEnum,
} from '@/app/models/claims/types/claim';
import { getIconForCategory } from '@/app/utils/categoryMapStyles';
import { getStatusColor, getPriorityColor } from '@/app/utils/claimColors';
import { useTranslation } from 'react-i18next';
import {
  FiExternalLink,
  FiType,
  FiAlertTriangle,
  FiCheckCircle,
  FiCalendar,
  FiTag,
} from 'react-icons/fi';

interface ClaimsDisplayMapProps {
  claims: ClaimWithMultimediaResponse[];
  onMarkerClick: (claimData: ClaimWithMultimediaResponse) => void;
  mapCenter?: [number, number];
  allClaimTypes: { value: number; label: string }[];
}

const MapViewUpdater: React.FC<{
  claims: ClaimWithMultimediaResponse[];
  initialCenter: LatLngExpression;
}> = ({ claims, initialCenter }) => {
  const map = useMap();

  useEffect(() => {
    if (claims && claims.length > 0) {
      const validCoords = claims
        .map((c) => c.claim.claimLocation?.coordinates)
        .filter(
          (coords) =>
            coords &&
            typeof coords[0] === 'number' &&
            typeof coords[1] === 'number'
        ) as [number, number][];

      if (validCoords.length > 0) {
        const leafletLatLngs = validCoords.map(
          (coordPair) => L.latLng(coordPair[1], coordPair[0]) // Latitude, Longitude
        );

        if (leafletLatLngs.length > 0) {
          const bounds = L.latLngBounds(leafletLatLngs);
          if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
          } else if (leafletLatLngs.length === 1) {
            map.setView(leafletLatLngs[0], 15);
          }
        } else {
          map.setView(initialCenter, 13);
        }
      } else {
        map.setView(initialCenter, 13);
      }
    } else {
      map.setView(initialCenter, 13);
    }
  }, [claims, map, initialCenter]);
  return null;
};

const ClaimsDisplayMap: React.FC<ClaimsDisplayMapProps> = ({
  claims,
  onMarkerClick,
  mapCenter = [-34.6037, -58.3816],
  allClaimTypes,
}) => {
  const { t, i18n } = useTranslation(['admin', 'claim', 'claimcreationform']);
  const mapRef = useRef<L.Map | null>(null);
  const [mapKey, setMapKey] = useState(Date.now());

  useEffect(() => {
    setMapKey(Date.now()); // Refresh the map when the claims change.
  }, [claims]);

  const getClaimTypeName = (typeId: number | undefined) => {
    if (typeId === undefined) return t('admin:unknown', 'Desconocido');
    const claimType = allClaimTypes.find((ct) => ct.value === typeId);
    return claimType ? claimType.label : t('admin:unknown', 'Desconocido');
  };

  const formatDateShort = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString(i18n.language, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-RCColors-700 shadow-lg">
      <MapContainer
        key={mapKey}
        className="w-full h-full z-0"
        center={mapCenter as LatLngExpression}
        zoom={13}
        scrollWheelZoom={true}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {claims.map((claimData) => {
          const { claim } = claimData;
          if (!claim.claimLocation || !claim.claimLocation.coordinates) {
            return null;
          }
          const [longitude, latitude] = claim.claimLocation.coordinates;
          if (
            typeof latitude !== 'number' ||
            typeof longitude !== 'number' ||
            isNaN(latitude) ||
            isNaN(longitude)
          ) {
            console.warn(
              `Reclamo ${claim.publicId} con coordenadas inválidas: [${longitude}, ${latitude}]`
            );
            return null;
          }
          const position: LatLngExpression = [latitude, longitude];

          const StatusIconComponent =
            claim.status === ClaimStatusEnum.Open
              ? FiAlertTriangle
              : FiCheckCircle;
          return (
            <Marker
              key={claim.publicId}
              position={position}
              icon={getIconForCategory(claim.typeCategoryId)}
            >
              <Popup minWidth={200} maxWidth={260}>
                <div className="space-y-1.5 p-0.5 text-xs">
                  <h4
                    className="font-semibold text-RCColors-900 text-sm leading-tight break-words mb-1"
                    title={claim.title}
                  >
                    {claim.title.length > 40
                      ? `${claim.title.substring(0, 37)}...`
                      : claim.title}
                  </h4>
                  <div className="flex items-center text-RCColors-600">
                    <FiType className="mr-1.5 w-3 h-3 text-RCColors-500 shrink-0" />
                    <span className="font-medium mr-1">
                      {t('admin:typeShort', 'Tipo')}:
                    </span>
                    <span
                      className="truncate"
                      title={getClaimTypeName(claim.typeCategoryId)}
                    >
                      {getClaimTypeName(claim.typeCategoryId)}
                    </span>
                  </div>
                  <div className="flex items-center text-RCColors-600">
                    <StatusIconComponent
                      className={`mr-1.5 w-3 h-3 shrink-0`}
                    />
                    <span className="font-medium mr-1">
                      {t('admin:status', 'Estado')}:
                    </span>
                    <span
                      className={`inline-block rounded-full ${getStatusColor(claim.status).replace('bg-', 'text-')} ${getStatusColor(claim.status).replace('400', '100')} bg-opacity-20`}
                    >
                      {t(`claim:status.${claim.status}`)}
                    </span>
                  </div>
                  <div className="flex items-center text-RCColors-600">
                    <FiTag className={`mr-1.5 w-3 h-3 shrink-0`} />
                    <span className="font-medium mr-1">
                      {t('admin:priority', 'Prioridad')}:
                    </span>
                    <span
                      className={`inline-block rounded-full ${getPriorityColor(claim.priority).replace('bg-', 'text-')} ${getPriorityColor(claim.priority).replace('400', '100')} bg-opacity-20`}
                    >
                      {t(`claimcreationform:priority.${claim.priority}`)}
                    </span>
                  </div>
                  <div className="flex items-center text-RCColors-600">
                    <FiCalendar className="mr-1.5 w-3 h-3 text-RCColors-500 shrink-0" />
                    <span className="font-medium mr-1">
                      {t('admin:dateShort', 'Fecha')}:
                    </span>
                    <span>{formatDateShort(claim.createdAt)}</span>
                  </div>
                  <button
                    onClick={() => onMarkerClick(claimData)}
                    className="mt-2 w-full flex items-center justify-center text-primary hover:text-primary-dark font-semibold py-1 px-2 rounded border border-primary hover:bg-primary/10 transition-colors duration-150"
                  >
                    {t('admin:viewDetails', 'Ver detalles')}
                    <FiExternalLink className="ml-1 w-3 h-3" />
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
        <MapViewUpdater
          claims={claims}
          initialCenter={mapCenter as LatLngExpression}
        />
      </MapContainer>
    </div>
  );
};

export default ClaimsDisplayMap;
