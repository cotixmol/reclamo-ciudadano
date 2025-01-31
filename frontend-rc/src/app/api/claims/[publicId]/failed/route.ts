import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';

interface FailedErrorResponse {
  detail?: string;
  error?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { publicId: string } }
) {
  try {
    const { publicId } = params;

    // We don't need a request body in this example, so pass `null`
    // This will forward the request to the Python backend endpoint
    const backendResponse = await axios.post<FailedErrorResponse>(
      `${process.env.API_URL}/claim/${publicId}/failed`,
      null,
      {
        validateStatus: () => true, // We'll handle non-200 status codes ourselves
      }
    );

    // If the backend didn't return 2xx, handle the error
    if (backendResponse.status !== 200) {
      const backendError = backendResponse.data;
      const errorMessage = backendError.detail ?? backendError.error ?? 'Failed to mark claim as failed';
      return NextResponse.json({ error: errorMessage }, { status: backendResponse.status });
    }

    // Otherwise, return the backend response directly
    return NextResponse.json(backendResponse.data, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}
