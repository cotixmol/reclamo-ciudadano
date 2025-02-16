// src/app/services/claims/create.ts
import axios from 'axios';
import {
  ClaimCreateRequest,
  CreateNewClaimResponse,
} from '@/app/models/claims/types/claim';

function savePublicId(newId: string) {
  const existing = localStorage.getItem('publicIds');
  const publicIds: string[] = existing ? JSON.parse(existing) : [];
  publicIds.push(newId);
  localStorage.setItem('publicIds', JSON.stringify(publicIds));
}

export async function createClaim(
  data: ClaimCreateRequest
): Promise<CreateNewClaimResponse> {
  try {
    const response = await axios.post<CreateNewClaimResponse>(
      '/api/claims/create',
      data
    );
    const { publicId } = response.data.newClaim;
    savePublicId(publicId);
    return response.data;
  } catch (error) {
    console.error('Error creating claim:', error);
    if (axios.isAxiosError(error) && error.response) {
      const { data } = error.response;
      throw new Error(typeof data === 'object' ? JSON.stringify(data) : data || 'Failed to create claim');
    }
    throw new Error('An unknown error occurred while creating claim');
  }
}
