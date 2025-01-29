'use client';

import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import { customMapIcon } from '../../customMapIcon';

interface MapSelectorProps {
  latitude: string;
  longitude: string;
  onLocationChangeAction: (lat: string, lng: string, address?: string) => void;
}

export default function MapSelector({
  latitude,
  longitude,
  onLocationChangeAction,
}: MapSelectorProps) {
  // Default center
  const [center] = React.useState<[number, number]>([
    parseFloat(latitude) || -34.6,
    parseFloat(longitude) || -58.4,
  ]);

  function GeocoderAndEvents() {
    const map = useMap();
    const geocoderControlRef = useRef<any>(null);

    useEffect(() => {
      if (!map) return;
      if (geocoderControlRef.current) return;

      // Initialize geocoder
      const geocoderControl = (L.Control as any)
        .geocoder({
          geocoder: (L.Control as any).Geocoder.nominatim(),
          defaultMarkGeocode: false,
        })
        .addTo(map);

      geocoderControl.on('markgeocode', (e: any) => {
        if (!e.geocode) return;
        const { center, name } = e.geocode;
        if (!center) return;
        onLocationChangeAction(
          center.lat.toString(),
          center.lng.toString(),
          name
        );
        map.setView(center, map.getZoom());
      });

      geocoderControlRef.current = geocoderControl;
      return () => {
        if (geocoderControlRef.current) {
          geocoderControlRef.current.remove();
          geocoderControlRef.current = null;
        }
      };
    }, [map]);

    return null;
  }

  return (
    <MapContainer
      className="w-full h-64 border-2 border-gray-700 rounded-lg shadow-lg"
      center={center}
      zoom={16}
      scrollWheelZoom
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GeocoderAndEvents />

      {/* 
        Pass our custom React Icons DivIcon using the createReactIcon() function.
        You can change the color string as you wish. 
      */}
      <Marker
        position={
          [
            parseFloat(latitude) || center[0],
            parseFloat(longitude) || center[1],
          ] as LatLngExpression
        }
        icon={customMapIcon('e4047d')}
      />
    </MapContainer>
  );
}
