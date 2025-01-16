import axios from 'axios';
import { ClaimResponse } from '@/app/models/claims/types/types';

function getStoredPublicIds(): string[] {
  const existing = localStorage.getItem('publicIds');
  return existing ? JSON.parse(existing) : [];
}

export async function fetchAllClaimsByPublicIds(): Promise<ClaimResponse[]> {
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

export async function fetchClaimByPublicId(publicId: string): Promise<ClaimResponse> {
  try {
    const response = await axios.get<ClaimResponse>(`/api/claims/${publicId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching claim by public ID:', error);
    throw error;
  }
}

