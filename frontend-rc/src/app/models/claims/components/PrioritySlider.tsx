// src/app/models/claims/components/PrioritySlider.tsx

'use client';

import React from 'react';
import { PriorityEnum } from '../types/claim';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import '../../../i18n';
import { useTranslation } from 'react-i18next';

interface PrioritySliderProps {
  selectedPriority: PriorityEnum;
  onPriorityChange: (priority: PriorityEnum) => void;
}

const PrioritySlider: React.FC<PrioritySliderProps> = ({
  selectedPriority,
  onPriorityChange,
}) => {
  const { t } = useTranslation('claimcreationform');

  const marks = [
    {
      value: 1,
      label: <span className="text-green-300">{t('priority.LOW')}</span>, // Tailwind's green-300
    },
    {
      value: 2,
      label: <span className="text-yellow-300">{t('priority.MEDIUM')}</span>, // Tailwind's yellow-300
    },
    {
      value: 3,
      label: <span className="text-red-300">{t('priority.HIGH')}</span>, // Tailwind's red-300
    },
  ];

  // Map PriorityEnum to numerical values for the slider
  const priorityValues: { [key in PriorityEnum]: number } = {
    [PriorityEnum.LOW]: 1,
    [PriorityEnum.MEDIUM]: 2,
    [PriorityEnum.HIGH]: 3,
  };

  // Map numerical values back to PriorityEnum
  const valueToPriority: { [key: number]: PriorityEnum } = {
    1: PriorityEnum.LOW,
    2: PriorityEnum.MEDIUM,
    3: PriorityEnum.HIGH,
  };

  const handleChange = (e: Event, value: number | number[]) => {
    if (typeof value === 'number') {
      const priority = valueToPriority[value];
      onPriorityChange(priority);
    }
  };

  return (
    <Box sx={{ paddingX: 2, paddingY: 1, width: '100%' }}>
      <Slider
        aria-label="Priority"
        value={priorityValues[selectedPriority]}
        onChange={handleChange}
        step={1}
        marks={marks}
        min={1}
        max={3}
        sx={{
          color: '#ec4899',
          '& .MuiSlider-rail': {
            color: '#4b5563',
          },
          // Remove the generic label color to allow Tailwind classes to take effect
          '& .MuiSlider-markLabel': {},
        }}
      />
    </Box>
  );
};

export default PrioritySlider;
