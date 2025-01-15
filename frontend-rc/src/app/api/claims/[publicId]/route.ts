import { NextResponse } from "next/server";
import axios from "axios";
import { ClaimResponse } from "@/app/models/claims/utils/types";

export async function GET(
  request: Request,
  context: { params: { publicId: string } }
): Promise<NextResponse> {
  try {
    const { publicId } = await context.params;

    if (!publicId) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const response = await axios.get<ClaimResponse>(
      `${process.env.API_URL}/claim/${publicId}`
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error("Error fetching claim:", error);
    let errorMessage = "Failed to fetch claim";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
