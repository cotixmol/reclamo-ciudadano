// src/utils/claimColors.ts
import { ClaimStatusEnum, PriorityEnum } from '@/app/models/claims/types/claim';

export const getStatusColor = (status: ClaimStatusEnum): string => {
  switch (status) {
    case ClaimStatusEnum.Open:
      return 'bg-blue-400';
    case ClaimStatusEnum.Close:
      return 'bg-red-400';
    default:
      return 'bg-green-400';
  }
};

export const getPriorityColor = (priority: PriorityEnum): string => {
  switch (priority) {
    case PriorityEnum.LOW:
      return 'bg-green-400';
    case PriorityEnum.MEDIUM:
      return 'bg-yellow-400';
    case PriorityEnum.HIGH:
      return 'bg-red-400';
    default:
      return 'bg-RCColors-400';
  }
};
