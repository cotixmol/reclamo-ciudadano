// src/app/api/route.ts
import { NextResponse } from 'next/server';
import apiClient from '@/app/middleware/apiClients';
import { toCamelCase } from '@/app/utils/toCamelCase';
import { RawClaimTypesResponse } from '@/app/models/claimTypes/types/claimTypes';

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const response = await apiClient.get<RawClaimTypesResponse[]>('/claim_types');
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
