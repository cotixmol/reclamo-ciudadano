import { NextResponse } from 'next/server';
import axios from 'axios';
import { toCamelCase } from '@/app/utils/toCamelCase';
import {
  MultimediaMetadataRequest,
  MultimediaMetadataResponse,
  MultimediaErrorResponse,
} from '@/app/models/claims/types/claim';

export async function POST(request: Request) {
  try {
    const body: MultimediaMetadataRequest = await request.json();
    const backendResponse = await axios.post<
      MultimediaMetadataResponse | MultimediaErrorResponse
    >(`${process.env.API_URL}/multimedia_metadata`, body, {
      validateStatus: () => true,
      headers: {
        'x-api-key': process.env.API_KEY || '',
        'x-client-name': process.env.API_CLIENT_NAME || '',
      },
    });
    if (backendResponse.status !== 200) {
      const backendError = backendResponse.data as MultimediaErrorResponse;
      return NextResponse.json(
        {
          error: backendError.detail ?? 'Failed to create multimedia metadata',
        },
        { status: backendResponse.status }
      );
    }

    const transformedData = toCamelCase(
      backendResponse.data as MultimediaMetadataResponse
    );
    return NextResponse.json(transformedData, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: 'Unexpected error occurred' },
      { status: 500 }
    );
  }
}
