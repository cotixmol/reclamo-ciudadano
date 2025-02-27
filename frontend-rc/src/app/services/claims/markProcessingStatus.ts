import axios from 'axios';

export async function markClaimAsFailed(publicId: string): Promise<void> {
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/claims/${publicId}/failed`,
      {}
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { data } = error.response;
      throw new Error(
        typeof data === 'object'
          ? JSON.stringify(data)
          : data || 'Failed to mark claim as failed'
      );
    }
    throw new Error(
      'An unknown error occurred while marking the claim as failed'
    );
  }
}

export async function markClaimAsFinished(publicId: string): Promise<void> {
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/claims/${publicId}/finished`,
      {}
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { data } = error.response;
      throw new Error(
        typeof data === 'object'
          ? JSON.stringify(data)
          : data || 'Failed to mark claim as finished'
      );
    }
    throw new Error(
      'An unknown error occurred while marking the claim as finished'
    );
  }
}
