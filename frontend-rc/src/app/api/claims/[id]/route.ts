import { NextResponse } from "next/server";
import axios from "axios";
import { Claim  } from "@/app/models/claims/utils/types";

export async function GET(
  request: Request,
  context: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const params = await context.params;
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const response = await axios.get<Claim>(
      `${process.env.API_URL}/claim/${id}`
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching claim:", error);
    return NextResponse.json(
      { error: "Failed to fetch claim" },
      { status: 500 }
    );
  }
}
