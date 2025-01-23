import axios from 'axios';
import { ClaimResponse } from '@/app/models/claims/types/claim';

function removePublicId(publicId: string) {
  const existing = localStorage.getItem('publicIds');
  const publicIds: string[] = existing ? JSON.parse(existing) : [];
  const updatedPublicIds = publicIds.filter((id) => id !== publicId);
  localStorage.setItem('publicIds', JSON.stringify(updatedPublicIds));
}

export async function deleteClaimByPublicId(publicId: string): Promise<ClaimResponse> {
  try {
    const response = await axios.delete<ClaimResponse>(`/api/claims/${publicId}`);
    removePublicId(publicId);
    return response.data;
  } catch (error) {
    console.error('Error deleting claim by public ID:', error);
    if (axios.isAxiosError(error) && error.response) {
      // The route sends back { error: ... }
      const { data } = error.response;
      throw new Error(data?.error || 'Failed to delete claim');
    }
    throw new Error('An unknown error occurred while deleting claim');
  }
}