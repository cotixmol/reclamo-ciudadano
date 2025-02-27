import axios from 'axios';
import { RawClaimTypesResponse } from '@/app/models/claimTypes/types/claimTypes';
import { toCamelCase } from '@/app/utils/toCamelCase';

export async function loadAllClaimsTypesAtBootstart(): Promise<RawClaimTypesResponse[]> {
  try {
    const endpoint = `${process.env.API_URL}/claim_types`;

    const response = await axios.get<RawClaimTypesResponse[]>(endpoint, {
      headers: {
        'x-api-key': process.env.API_KEY || '',
        'x-client-name': process.env.API_CLIENT_NAME || '',
      },
    });

    const transformedData = toCamelCase(response.data) as RawClaimTypesResponse[];

    return transformedData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { data } = error.response;
      throw new Error(
        typeof data === 'object'
          ? JSON.stringify(data)
          : data || 'Failed to fetch claim types'
      );
    }
    throw new Error('An unknown error occurred while fetching claim types');
  }
}
