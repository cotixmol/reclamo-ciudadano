import { NextResponse } from 'next/server';
import axios from 'axios';
import { ClaimResponse } from '@/app/models/claims/types/claim';
import { toCamelCase } from '@/app/utils/toCamelCase';
import { ClaimUpdateRequest } from '@/app/models/claims/types/claim';

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

export async function DELETE(
  request: Request,
  context: { params: { publicId: string } }
): Promise<NextResponse> {
  try {
    const { publicId } = await context.params;
    if (!publicId) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    await axios.delete(`${process.env.API_URL}/claim/${publicId}`);
    return NextResponse.json(
      { message: 'Claim deleted successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error deleting claim:', error);
    let errorMessage = 'Failed to delete claim';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
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

    const response = await axios.put<ClaimResponse>(
      `${process.env.API_URL}/claim/${publicId}`,
      body
    );

    const transformedData: ClaimResponse = toCamelCase(response.data);
    return NextResponse.json(transformedData, { status: 200 });
  } catch (error: unknown) {
    console.error('Error updating claim:', error);
    let errorMessage = 'Failed to update claim';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
