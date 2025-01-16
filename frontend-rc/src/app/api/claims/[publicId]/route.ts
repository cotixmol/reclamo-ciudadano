import { NextResponse } from 'next/server';
import axios from 'axios';
import { ClaimResponse } from '@/app/models/claims/types/types';
import { toCamelCase } from '@/app/utils/toCamelCase';

export async function GET(
  request: Request,
  context: { params: { publicId: string } }
): Promise<NextResponse> {
  try {
    const { publicId } = await context.params;
    if (!publicId) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    const response = await axios.get<ClaimResponse>(
      `${process.env.API_URL}/claim/${publicId}`
    );
    const transformedData: ClaimResponse = toCamelCase(response.data);

    return NextResponse.json(transformedData, { status: 200 });
  } catch (error: unknown) {
    console.error('Error fetching claim:', error);
    let errorMessage = 'Failed to fetch claim';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
