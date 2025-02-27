// components/PrioritySection.tsx
import React from 'react';
import PrioritySlider from './PrioritySlider';
import { PriorityEnum } from '../../types/claim';
import { useTranslation } from 'react-i18next';

interface PrioritySectionProps {
  priority: PriorityEnum;
  setPriority: (priority: PriorityEnum) => void;
}

const PrioritySection: React.FC<PrioritySectionProps> = ({
  priority,
  setPriority,
}) => {
  const { t } = useTranslation('claimcreationform');

  return (
    <div>
      <label htmlFor="priority" className="block mb-1">
        {t('priorityLabelTitle')}
      </label>
      <p className="text-sm text-RCColors-500 mt-1">
        {t('priorityDescription')}
      </p>
      <PrioritySlider
        selectedPriority={priority}
        onPriorityChange={setPriority}
      />
    </div>
  );
};

export default PrioritySection;
