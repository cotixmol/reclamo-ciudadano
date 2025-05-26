'use client';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { customMapIcon } from '@/app/models/claims/components/ClaimForm/Map/customMapIcon';

interface StaticMapDisplayProps {
  latitude: number | null;
  longitude: number | null;
  address?: string;
}

// Internal component for adjusting the map view once loaded
const ChangeView: React.FC<{ center: LatLngExpression; zoom: number }> = ({
  center,
  zoom,
}) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
};

const StaticMapDisplay: React.FC<StaticMapDisplayProps> = ({
  latitude,
  longitude,
}) => {
  const [mapKey, setMapKey] = useState(Date.now());

  useEffect(() => {
    setMapKey(Date.now());
  }, [latitude, longitude]);

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return (
      <div className="w-full h-64 bg-RCColors-700 rounded-lg flex items-center justify-center text-RCColors-400">
        No hay ubicación disponible.
      </div>
    );
  }

  const position: LatLngExpression = [latitude, longitude];

  return (
    <div className="relative w-full h-64 border border-RCColors-600 rounded-lg shadow-md overflow-hidden">
      <MapContainer
        key={mapKey}
        className="w-full h-full z-0"
        center={position}
        zoom={16}
        scrollWheelZoom={false}
        zoomControl={true}
        dragging={true}
        touchZoom={true}
        doubleClickZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={customMapIcon('e4047d')}>
          {/* <Tooltip>{address || "Ubicación del reclamo"}</Tooltip> */}
        </Marker>
        <ChangeView center={position} zoom={16} />
      </MapContainer>
    </div>
  );
};

export default StaticMapDisplay;
