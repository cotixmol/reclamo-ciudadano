'use client';
import React from 'react';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { FaMapMarkerAlt } from 'react-icons/fa';

export function customMapIcon(color: string) {
  const iconMarkup = ReactDOMServer.renderToString(
    <FaMapMarkerAlt size={32} color={color} />
  );

  return L.divIcon({
    html: iconMarkup,
    className: 'custom-leaflet-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
}
