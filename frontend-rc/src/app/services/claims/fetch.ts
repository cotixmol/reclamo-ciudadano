import axios from 'axios';
import { ClaimResponse } from '@/app/models/claims/utils/types';

function getStoredPublicIds(): string[] {
  const existing = localStorage.getItem('publicIds');
  return existing ? JSON.parse(existing) : [];
}

export async function fetchClaims(): Promise<ClaimResponse[]> {
  const publicIds = getStoredPublicIds();
  try {
    const response = await axios.post<ClaimResponse[]>('/api/claims', {
      public_ids: publicIds,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching claims:', error);
    throw error;
  }
}
