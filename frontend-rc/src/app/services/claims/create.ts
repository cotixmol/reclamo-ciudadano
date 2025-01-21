import axios from 'axios';
import {
  ClaimCreateRequest,
  ClaimResponse,
} from '@/app/models/claims/types/claim';

function savePublicId(newId: string) {
  const existing = localStorage.getItem('publicIds');
  const publicIds: string[] = existing ? JSON.parse(existing) : [];
  publicIds.push(newId);
  localStorage.setItem('publicIds', JSON.stringify(publicIds));
}

export async function createClaim(
  data: ClaimCreateRequest
): Promise<ClaimResponse> {
  try {
    const response = await axios.post<ClaimResponse>(
      '/api/claims/create',
      data
    );
    const { publicId } = response.data;
    savePublicId(publicId);
    return response.data;
  } catch (error) {
    console.error('Error in createClaim service:', error);
    throw error;
  }
}
