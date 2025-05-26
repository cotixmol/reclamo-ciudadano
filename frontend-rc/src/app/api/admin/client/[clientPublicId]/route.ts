import { NextResponse,  } from 'next/server';
import axios from 'axios';
import { toCamelCase } from '@/app/utils/toCamelCase';
import {
  ClaimWithMultimediaResponse,
  ClaimErrorResponse,
} from '@/app/models/claims/types/claim';

const headersConfig = {
  'x-api-key': process.env.API_KEY || '',
  'x-client-name': process.env.API_CLIENT_NAME || '',
};

export async function GET(
  request: Request,
  context: any
): Promise<NextResponse> {
  try {
    const { clientPublicId } = await context.params;
    if (!clientPublicId) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
    }

    const backendResponse = await axios.get<
      ClaimWithMultimediaResponse[] | ClaimErrorResponse
    >(`${process.env.API_URL}/admin/claim/${clientPublicId}`, {
      validateStatus: () => true,
      headers: headersConfig,
    });

    if (backendResponse.status !== 200) {
      const backendError = backendResponse.data as ClaimErrorResponse;
      return NextResponse.json(
        {
          error: backendError.detail ?? 'Failed to fetch claims for this client',
        },
        { status: backendResponse.status }
      );
    }

    const transformedData = toCamelCase(
      backendResponse.data as ClaimWithMultimediaResponse[]
    );
    return NextResponse.json(transformedData, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    });
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