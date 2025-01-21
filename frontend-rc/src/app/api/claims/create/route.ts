import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';
import { toCamelCase } from '@/app/utils/toCamelCase';
import {
  ClaimCreateRequest,
  ClaimResponse,
} from '@/app/models/claims/types/types';

export async function POST(request: NextRequest) {
  try {
    const body: ClaimCreateRequest = await request.json();
    const response = await axios.post<ClaimResponse>(
      `${process.env.API_URL}/claim`,
      body
    );
    const transformedData: ClaimResponse = toCamelCase(response.data);
    return NextResponse.json(transformedData, { status: 200 });
  } catch (error) {
    console.error('Error creating claim:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
