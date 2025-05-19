import axios from 'axios';
import { ClaimWithMultimediaResponse } from '@/app/models/claims/types/claim';

export async function fetchAllClaimsByClientId(
  clientPublicId: string
): Promise<ClaimWithMultimediaResponse[]> {
  try {
    const response = await axios.get<ClaimWithMultimediaResponse[]>(
      `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/admin/client/${clientPublicId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { data } = error.response;
      throw new Error(data?.error || 'Failed to fetch claims for this client');
    }
    throw new Error('An unknown error occurred while fetching claims for this client');
  }
}
