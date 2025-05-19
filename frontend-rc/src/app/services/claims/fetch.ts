import axios from 'axios';
import { ClaimWithMultimediaResponse } from '@/app/models/claims/types/claim';



export async function fetchAllClaimsByPublicIds(
    claimPublicIds: string[]
): Promise<
  ClaimWithMultimediaResponse[]
> {
  try {
    const response = await axios.post<ClaimWithMultimediaResponse[]>(
      `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/claims`,
      {
        public_ids: claimPublicIds,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching claims:', error);
    if (axios.isAxiosError(error) && error.response) {
      const { data } = error.response;
      throw new Error(
        typeof data === 'object'
          ? JSON.stringify(data)
          : data || 'Failed to fetch claim'
      );
    }
    throw new Error('An unknown error occurred');
  }
}

export async function fetchClaimByPublicId(
  claimPublicId: string
): Promise<ClaimWithMultimediaResponse> {
  try {
    const response = await axios.get<ClaimWithMultimediaResponse>(
      `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/claims/${claimPublicId}`
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
