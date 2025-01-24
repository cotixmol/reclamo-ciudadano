import axios from 'axios';
import { ClaimTypesResponse } from '@/app/models/claimTypes/types/claimTypes';

export async function loadAllClaimsTypesAtBootstart(): Promise<ClaimTypesResponse[]> {
  try {
    const response = await axios.get<ClaimTypesResponse[]>(`${process.env.API_URL}/claim_types`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { data } = error.response;
      throw new Error(data?.error || 'Failed to fetch claim');
    }
    throw new Error('An unknown error occurred while fetching claim');
  }
}