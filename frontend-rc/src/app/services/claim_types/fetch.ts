import axios from 'axios';
import { RawClaimTypesResponse } from '@/app/models/claimTypes/types/claimTypes';
import { headers } from 'next/headers';

export async function loadAllClaimsTypesAtBootstart(): Promise<RawClaimTypesResponse[]> {
  try {
    const response = await axios.get<RawClaimTypesResponse[]>(
      `${process.env.NEXT_PUBLIC_INTERNAL_API_URL}/claim_types`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { data } = error.response;
      throw new Error(typeof data === 'object' ? JSON.stringify(data) : data || 'Failed to fetch claim types');
    }
    throw new Error('An unknown error occurred while fetching claim types');
  }
}
