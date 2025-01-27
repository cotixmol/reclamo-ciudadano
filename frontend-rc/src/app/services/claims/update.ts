import axios from 'axios';
import { ClaimResponse, ClaimUpdateRequest } from '@/app/models/claims/types/claim';

export async function updateClaimByPublicId(
  publicId: string,
  payload: ClaimUpdateRequest
): Promise<ClaimResponse> {
  try {
    const response = await axios.put<ClaimResponse | { error: string }>(
      `/api/claims/${publicId}`,
      payload
    );
    return response.data as ClaimResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { data } = error.response;
      throw new Error(data?.error || 'Failed to update claim');
    }
    throw new Error('An unknown error occurred');
  }
}
