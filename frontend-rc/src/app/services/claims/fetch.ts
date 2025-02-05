import axios from 'axios';
import { ClaimWithMultimediaResponse } from '@/app/models/claims/types/claim';

function getStoredPublicIds(): string[] {
  const existing = localStorage.getItem('publicIds');
  return existing ? JSON.parse(existing) : [];
}

export async function fetchAllClaimsByPublicIds(): Promise<
  ClaimWithMultimediaResponse[]
> {
  const publicIds = getStoredPublicIds();
  try {
    const response = await axios.post<ClaimWithMultimediaResponse[]>(
      '/api/claims',
      {
        public_ids: publicIds,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching claims:', error);

    if (axios.isAxiosError(error) && error.response) {
      const { data } = error.response;
      throw new Error(data?.error || 'Failed to fetch claims');
    }
    throw new Error('An unknown error occurred');
  }
}

export async function fetchClaimByPublicId(
  publicId: string
): Promise<ClaimWithMultimediaResponse> {
  try {
    const response = await axios.get<ClaimWithMultimediaResponse>(
      `/api/claims/${publicId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { data } = error.response;
      throw new Error(data?.error || 'Failed to fetch claim');
    }
    throw new Error('An unknown error occurred while fetching claim');
  }
}
