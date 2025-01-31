import axios from 'axios';

export async function markClaimAsFailed(publicId: string): Promise<void> {
  try {
    await axios.post(`/api/claims/${publicId}/failed`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.error ?? 'Failed to mark claim as failed';
      throw new Error(errorMsg);
    }
    throw new Error('An unknown error occurred while marking the claim as failed');
  }
}


export async function markClaimAsFinished(publicId: string): Promise<void> {
  try {
    await axios.post(`/api/claims/${publicId}/finished`);

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.error ?? 'Failed to mark claim as finished';
      throw new Error(errorMsg);
    }
    throw new Error('An unknown error occurred while marking the claim as finished');
  }
}
