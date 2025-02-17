import axios from 'axios';
import { RawClaimTypesResponse } from '@/app/models/claimTypes/types/claimTypes';

export async function loadAllClaimsTypesAtBootstart(): Promise<
  RawClaimTypesResponse[]
> {
  try {
    const response = await axios.get<RawClaimTypesResponse[]>(
      `${process.env.API_URL}/claim_types`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { data } = error.response;
      throw new Error(data?.error || 'Failed to fetch claim');
    }
    throw new Error('An unknown error occurred while fetching claim');
  }
}
