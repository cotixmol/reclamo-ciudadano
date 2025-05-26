import React from 'react';
import { useTranslation } from 'react-i18next';
import { categoryColors } from '@/app/utils/categoryMapStyles';
import { useClaimTypes } from '@/app/context/ClaimTypesContext';
import { RawClaimTypesResponse } from '@/app/models/claimTypes/types/claimTypes';

const MapLegend: React.FC = () => {
  const { t, i18n } = useTranslation(['admin']);
  const allClaimTypesFromContext = useClaimTypes();

  const legendItems = Object.entries(categoryColors)
    .map(([id, color]) => {
      const numericId = parseInt(id, 10);
      const claimTypeInfo = allClaimTypesFromContext.find(
        (ct: RawClaimTypesResponse) => ct.id === numericId
      );

      let categoryName = t('admin:map.categoryOther', 'Otros');
      if (claimTypeInfo) {
        categoryName = i18n.language === 'es' ? claimTypeInfo.categoryEs : claimTypeInfo.categoryEn;
      } else if (numericId === 9) {
        categoryName = t('admin:map.unknown', 'Desconocido');
      }

      return {
        id: numericId,
        name: categoryName,
        color: color,
      };
    })
    .sort((a, b) => a.id - b.id);

  return (
    <div className="absolute bottom-8 right-4 z-[10]"> 
      <div className="bg-white/80 p-3 rounded-md shadow-lg backdrop-blur-md max-w-xs">
        <h4 className="text-sm font-bold mb-2 text-RCColors-900">
          {t('admin:map.legendTitle', 'Tipos de reclamo')}
        </h4>
        <ul className="space-y-1">
          {legendItems.map((item) => (
            <li key={item.id} className="flex items-center">
              <span
                className="w-4 h-4 rounded-full mr-2 border border-gray-700"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="text-xs text-RCColors-800">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MapLegend;