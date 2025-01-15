import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';
import { toCamelCase } from '@/app/utils/toCamelCase';
import {
  ApiPublicIdsRequest,
  ClaimListResponse,
} from '@/app/models/claims/utils/types';
export async function POST(request: NextRequest) {
  try {
    const body: ApiPublicIdsRequest = await request.json();
    const response = await axios.post<ClaimListResponse>(
      `${process.env.API_URL}/claims`,
      body
    );
    const transformedData: ClaimListResponse = toCamelCase(response.data);
    return NextResponse.json(transformedData, { status: 200 });
  } catch (error) {
    console.error('Error fetching claims:', error);
    return NextResponse.json(
      { error: error || 'Unexpected error' },
      { status: 500 }
    );
  }
}
