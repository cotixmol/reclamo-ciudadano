import axios from 'axios';
import { ClaimResponse } from '@/app/models/claims/types/claim';

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
    if (response) {
      return response.data;
    }
    return [];
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
    if (axios.isAxiosError(error) && error.response) {
      const { data } = error.response;
      throw new Error(data?.error || 'Failed to fetch claim');
    }
    throw new Error('An unknown error occurred');
  }
}