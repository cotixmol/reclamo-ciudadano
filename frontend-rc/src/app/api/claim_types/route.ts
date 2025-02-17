import { NextResponse } from 'next/server';
import axios from 'axios';
import { toCamelCase } from '@/app/utils/toCamelCase';
import { RawClaimTypesResponse } from '@/app/models/claimTypes/types/claimTypes';

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const response = await axios.get<RawClaimTypesResponse[]>(
      `${process.env.API_URL}/claim_types`,
      {
        headers: {
          'x-api-key': process.env.API_KEY || '',
          'x-client-name': process.env.API_CLIENT_NAME || '',
        },
      }
    );
    const transformedData: RawClaimTypesResponse[] = toCamelCase(response.data);
    return NextResponse.json(transformedData, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching types of claim:', error);
    let errorMessage = 'Failed to fetch claim';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
