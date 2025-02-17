// src/app/services/claims/delete.ts
import axios from 'axios';
import { ClaimResponse } from '@/app/models/claims/types/claim';

function removePublicId(publicId: string) {
  const existing = localStorage.getItem('publicIds');
  const publicIds: string[] = existing ? JSON.parse(existing) : [];
  const updatedPublicIds = publicIds.filter((id) => id !== publicId);
  localStorage.setItem('publicIds', JSON.stringify(updatedPublicIds));
}

export async function deleteClaimByPublicId(
  publicId: string
): Promise<ClaimResponse> {
  try {
    const response = await axios.delete<ClaimResponse>(
      `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/claims/${publicId}`
    );
    removePublicId(publicId);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { data } = error.response;
      throw new Error(
        typeof data === 'object'
          ? JSON.stringify(data)
          : data || 'Failed to delete claim'
      );
    }
    throw new Error('An unknown error occurred while deleting claim');
  }
}
