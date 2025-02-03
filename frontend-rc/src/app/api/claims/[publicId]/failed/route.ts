import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

interface FailedErrorResponse {
  detail?: string;
  error?: string;
}

export async function POST(
  request: NextRequest,
  context: { params: { publicId: string } }
) {
  try {
    const { publicId } = await context.params;

    const backendResponse = await axios.post<FailedErrorResponse>(
      `${process.env.API_URL}/claim/${publicId}/failed`,
      null,
      {
        validateStatus: () => true,
      }
    );

    if (backendResponse.status !== 200) {
      const backendError = backendResponse.data;
      const errorMessage = backendError.detail ?? backendError.error ?? 'Failed to mark claim as failed';
      return NextResponse.json({ error: errorMessage }, { status: backendResponse.status });
    }

    return NextResponse.json(backendResponse.data, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}
