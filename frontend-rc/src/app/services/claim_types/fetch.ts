import axios from 'axios'; // For axios.isAxiosError
import apiClient from '@/app/middleware/apiClients';
import { RawClaimTypesResponse } from '@/app/models/claimTypes/types/claimTypes';

export async function loadAllClaimsTypesAtBootstart(): Promise<RawClaimTypesResponse[]> {
  try {
    const response = await apiClient.get<RawClaimTypesResponse[]>('/claim_types');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { data } = error.response;
      throw new Error(typeof data === 'object' ? JSON.stringify(data) : data || 'Failed to fetch claim');
    }
    throw new Error('An unknown error occurred while fetching claim');
  }
}
