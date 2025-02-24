'use client';

import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import { customMapIcon } from './customMapIcon';

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
  const [center] = React.useState<[number, number]>([
    parseFloat(latitude) || -34.6,
    parseFloat(longitude) || -58.4,
  ]);

  const markerRef = useRef<any>(null);
  const mapRef = useRef<any>(null);

  const eventHandlers = React.useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker && mapRef.current) {
          const latLng = marker.getLatLng();
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latLng.lat}&lon=${latLng.lng}`;
          fetch(url)
            .then((res) => res.json())
            .then((data) => {
              const address = data.display_name || '';
              onLocationChangeAction(
                latLng.lat.toString(),
                latLng.lng.toString(),
                address
              );
              mapRef.current.setView(latLng, mapRef.current.getZoom());
            })
            .catch((err) =>
              console.error('Error during reverse geocoding:', err)
            );
        }
      },
    }),
    [onLocationChangeAction]
  );

  function GeocoderAndEvents() {
    const map = useMap();
    const geocoderControlRef = useRef<any>(null);

    useEffect(() => {
      if (!map) return;
      mapRef.current = map;
      if (geocoderControlRef.current) return;

      const geocoderControl = (L.Control as any)
        .geocoder({
          geocoder: (L.Control as any).Geocoder.nominatim(),
          defaultMarkGeocode: false,
          collapsed: false,
          position: 'topleft',
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

      const inputEl = document.querySelector(
        '.leaflet-control-geocoder-form input'
      ) as HTMLInputElement | null;
      if (inputEl) {
        inputEl.placeholder = 'Ingresa Dirección';
      }

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
      className="w-full h-64 border-2 border-RCColors-700 rounded-lg shadow-lg relative"
      center={center}
      zoom={16}
      scrollWheelZoom
      zoomControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GeocoderAndEvents />
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={
          [
            parseFloat(latitude) || center[0],
            parseFloat(longitude) || center[1],
          ] as LatLngExpression
        }
        icon={customMapIcon('e4047d')}
        ref={markerRef}
      />
    </MapContainer>
  );
}
