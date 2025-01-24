// src/app/services/claims/create.ts
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
    console.error('Error creating claim:', error);
    if (axios.isAxiosError(error) && error.response) {
      const { data } = error.response;
      throw new Error(data?.error || 'Failed to create claim');
    }
    throw new Error('An unknown error occurred while creating claim');
  }
}
