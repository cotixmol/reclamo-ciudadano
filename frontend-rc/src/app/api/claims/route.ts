import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';
import { toCamelCase } from '@/app/utils/toCamelCase';
import {
  ApiPublicIdsRequest,
  ClaimResponse,
} from '@/app/models/claims/types/claim';

export async function POST(request: NextRequest) {
  try {
    const body: ApiPublicIdsRequest = await request.json();
    const response = await axios.post<ClaimResponse[]>(
      `${process.env.API_URL}/claims`,
      body
    );
    const transformedData: ClaimResponse[] = toCamelCase(response.data);
    return NextResponse.json(transformedData, { status: 200 });
  } catch (error) {
    console.error('Error fetching claims:', error);
    return NextResponse.json(
      { error: error || 'Unexpected error' },
      { status: 500 }
    );
  }
}
