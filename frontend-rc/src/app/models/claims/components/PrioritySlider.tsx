// src/app/models/claims/components/PrioritySlider.tsx

'use client';

import React from 'react';
import { PriorityEnum } from '../types/claim';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface PrioritySliderProps {
  selectedPriority: PriorityEnum;
  onPriorityChange: (priority: PriorityEnum) => void;
}

const marks = [
  {
    value: 1,
    label: 'LOW',
  },
  {
    value: 2,
    label: 'MEDIUM',
  },
  {
    value: 3,
    label: 'HIGH',
  },
];

const PrioritySlider: React.FC<PrioritySliderProps> = ({
  selectedPriority,
  onPriorityChange,
}) => {
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

  const handleChange = (event: Event, value: number | number[]) => {
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
          color: '#ec4899', // Tailwind's pink-500
          '& .MuiSlider-rail': {
            color: '#4b5563', // Tailwind's gray-700
          },
          '& .MuiSlider-markLabel': {
            color: '#d1d5db', // Tailwind's gray-300
            fontSize: '0.75rem',
            fontWeight: 500,
          },
        }}
      />
    </Box>
  );
};

export default PrioritySlider;
