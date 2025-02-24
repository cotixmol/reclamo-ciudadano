'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';
import { customMapIcon } from './customMapIcon';
import { useTranslation } from 'react-i18next';

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
  // Local center to display the map
  const [center, setCenter] = useState<[number, number]>([
    parseFloat(latitude) || -34.6,
    parseFloat(longitude) || -58.4,
  ]);
  const [isLocating, setIsLocating] = useState(false);

  const { t } = useTranslation('claimcreationform');
  const markerRef = useRef<any>(null);
  const mapRef = useRef<any>(null);

  const eventHandlers = React.useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker && mapRef.current) {
          const latLng = marker.getLatLng();
          reverseGeocodeAndUpdate(latLng.lat, latLng.lng);
        }
      },
    }),
    []
  );

  function reverseGeocodeAndUpdate(lat: number, lng: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const address = data.display_name || '';
        onLocationChangeAction(lat.toString(), lng.toString(), address);
        setCenter([lat, lng]); // recenter the map
        if (mapRef.current) {
          mapRef.current.setView([lat, lng], mapRef.current.getZoom());
        }
      })
      .catch((err) => console.error('Error during reverse geocoding:', err));
  }

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported by this browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude: lat, longitude: lng } = position.coords;
        reverseGeocodeAndUpdate(lat, lng);
      },
      (error) => {
        setIsLocating(false);
        console.error('Geolocation Error:', error);
      },
      { enableHighAccuracy: true }
    );
  };

  function GeocoderAndEvents() {
    const map = useMap();
    const geocoderControlRef = useRef<any>(null);

    useEffect(() => {
      if (!map) return;
      mapRef.current = map;

      if (!geocoderControlRef.current) {
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
          const { center: geoCenter, name } = e.geocode;
          if (!geoCenter) return;
          onLocationChangeAction(
            geoCenter.lat.toString(),
            geoCenter.lng.toString(),
            name
          );
          setCenter([geoCenter.lat, geoCenter.lng]);
          map.setView(geoCenter, map.getZoom());
        });

        geocoderControlRef.current = geocoderControl;

        // Custom placeholder
        const inputEl = document.querySelector(
          '.leaflet-control-geocoder-form input'
        ) as HTMLInputElement | null;
        if (inputEl) {
          inputEl.placeholder = 'Ingresa dirección...';
        }
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
    <div className="relative w-full h-64 border-2 border-RCColors-700 rounded-lg shadow-lg">
      {/* Button to fetch current location */}
      <button
        type="button"
        onClick={handleGetCurrentLocation}
        className="absolute z-[9999] right-3 top-3 bg-RCColors-700 text-white px-3 py-1 
               rounded hover:bg-RCColors-600 shadow"
        disabled={isLocating}
      >
        {isLocating ? t('locating') : t('useMyLocation')}
      </button>

      <MapContainer
        className="w-full h-full"
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
          position={[center[0], center[1]] as LatLngExpression}
          icon={customMapIcon('e4047d')}
          ref={markerRef}
        />
      </MapContainer>
    </div>
  );
}
