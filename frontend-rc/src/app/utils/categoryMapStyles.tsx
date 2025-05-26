import L from 'leaflet';

export const CATEGORY_DEFAULT_COLOR = '#64047D';

export const categoryColors: { [key: number]: string } = {
  1: '#FFD700', // Lighting (golden yellow)
  2: '#A9A9A9', // Signage (dark gray)
  3: '#8B4513', // Sewage (brown)
  4: '#FF8C00', // Streets (dark orange)
  5: '#228B22', // Sanitation (forest green)
  6: '#DC143C', // Public Safety (crimson red)
  7: '#4682B4', // Public Health (steel blue)
  8: '#9370DB', // Public Spaces (medium purple)
  9: '#708090', // Others (slate gray)
};

export const createColoredIcon = (color: string, iconClassName?: string) => {
  const cleanColor = color.startsWith('#') ? color.substring(1) : color;
  return L.divIcon({
    html: `
      <svg width="32" height="32" viewBox="0 0 32 32" style="overflow: visible;">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.0001 31.9999C16.0001 31.9999 29.8668 19.8666 29.8668 12.2666C29.8668 8.69022 28.4372 5.26994 25.8996 2.73235C23.362 0.194761 19.9417 -0.633366 16.3654 0.200004C12.7954 0.015327 9.51816 1.24466 6.83869 3.60485C4.15922 5.96504 2.13344 9.26662 2.13344 12.2666C2.13344 19.8666 16.0001 31.9999 16.0001 31.9999Z" fill="#${cleanColor}" stroke="#FFF" stroke-width="1.5"/>
        <circle cx="16" cy="12" r="5" fill="white"/>
      </svg>
    `,
    className: `custom-map-icon ${iconClassName || ''}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32], // Icon tip
    popupAnchor: [0, -32], // Position of the popup relative to the icon
  });
};

export const getIconForCategory = (
  categoryId: number | undefined
): L.DivIcon => {
  const color =
    categoryId && categoryColors[categoryId]
      ? categoryColors[categoryId]
      : CATEGORY_DEFAULT_COLOR;
  return createColoredIcon(color);
};
