'use client';

import React, { useEffect } from 'react';
import { JSX } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';

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

  function GeocoderAndEvents(): JSX.Element {
    const map = useMap();
    const geocoderControlRef = React.useRef<any>(null);

    useEffect(() => {
      if (!map) return;
      if (geocoderControlRef.current) return;

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
    }, []);
    return <></>;
  }

  return (
    <MapContainer
      center={center}
      zoom={16}
      scrollWheelZoom
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GeocoderAndEvents />
      <Marker
        position={
          [
            parseFloat(latitude) || center[0],
            parseFloat(longitude) || center[1],
          ] as LatLngExpression
        }
      />{' '}
    </MapContainer>
  );
}
