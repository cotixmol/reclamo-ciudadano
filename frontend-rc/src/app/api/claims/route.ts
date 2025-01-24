import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';
import { toCamelCase } from '@/app/utils/toCamelCase';
import {
  ApiPublicIdsRequest,
  ClaimResponse,
  ClaimErrorResponse,
} from '@/app/models/claims/types/claim';

export async function POST(request: NextRequest) {
  try {
    const body: ApiPublicIdsRequest = await request.json();

    const backendResponse = await axios.post<
      ClaimResponse[] | ClaimErrorResponse
    >(`${process.env.API_URL}/claims`, body, {
      validateStatus: () => true,
    });

    if (backendResponse.status !== 200) {
      const backendError = backendResponse.data as ClaimErrorResponse;
      return NextResponse.json(
        {
          error: backendError.detail ?? 'Failed to fetch claims',
        },
        { status: backendResponse.status }
      );
    }

    const transformedData = toCamelCase(
      backendResponse.data as ClaimResponse[]
    );
    return NextResponse.json(transformedData, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
