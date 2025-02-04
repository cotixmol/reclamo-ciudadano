import { NextResponse } from 'next/server';
import axios from 'axios';
import { toCamelCase } from '@/app/utils/toCamelCase';
import {
  ClaimWithMultimediaResponse,
  ClaimResponse,
  ClaimUpdateRequest,
  ClaimErrorResponse,
} from '@/app/models/claims/types/claim';

export async function GET(
  request: Request,
  context: { params: { publicId: string } }
): Promise<NextResponse> {
  try {
    const { publicId } = await context.params;
    if (!publicId) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const backendResponse = await axios.get<ClaimWithMultimediaResponse | ClaimErrorResponse>(
      `${process.env.API_URL}/claim/${publicId}`,
      {
        validateStatus: () => true,
      }
    );

    if (backendResponse.status !== 200) {
      const backendError = backendResponse.data as ClaimErrorResponse;
      return NextResponse.json(
        {
          error: backendError.detail ?? 'Failed to fetch claim',
        },
        { status: backendResponse.status }
      );
    }

    const transformedData = toCamelCase(backendResponse.data as ClaimWithMultimediaResponse);
    return NextResponse.json(transformedData, { 
      status: 200, 
      headers: { 'Cache-Control': 'no-store' }
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

export async function DELETE(
  request: Request,
  context: { params: { publicId: string } }
): Promise<NextResponse> {
  try {
    const { publicId } = await context.params;

    if (!publicId) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const backendResponse = await axios.delete<
      ClaimResponse | ClaimErrorResponse
    >(`${process.env.API_URL}/claim/${publicId}`, {
      validateStatus: () => true,
    });

    if (backendResponse.status !== 200) {
      const backendError = backendResponse.data as ClaimErrorResponse;
      return NextResponse.json(
        {
          error: backendError.detail ?? 'Failed to delete claim',
        },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(
      { message: 'Claim deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting claim:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: 'Unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: { publicId: string } }
): Promise<NextResponse> {
  try {
    const { publicId } = await context.params;
    if (!publicId) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    const body: ClaimUpdateRequest = await request.json();

    const backendResponse = await axios.put<ClaimResponse | ClaimErrorResponse>(
      `${process.env.API_URL}/claim/${publicId}`,
      body,
      {
        validateStatus: () => true,
      }
    );

    if (backendResponse.status !== 200) {
      const backendError = backendResponse.data as ClaimErrorResponse;
      return NextResponse.json(
        {
          error: backendError.detail ?? 'Failed to update claim',
        },
        { status: backendResponse.status }
      );
    }

    const transformedData = toCamelCase(backendResponse.data as ClaimResponse);
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
