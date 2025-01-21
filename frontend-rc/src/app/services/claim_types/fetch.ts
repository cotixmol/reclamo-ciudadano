import axios from 'axios';
import { ClaimResponse } from '@/app/models/claims/types/claim';

export async function loadAllClaimsAtBootstart(): Promise<ClaimResponse[]> {
  try {
    const response = await axios.post<ClaimResponse[]>('/api/claim_types');
    if (response) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching types of claims:', error);
    throw error;
  }
}