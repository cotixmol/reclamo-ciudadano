import { NextResponse } from "next/server";
import axios from "axios";
import { Claim } from "@/app/models/claims/utils/types";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;

  try {
    const response = await axios.get<Claim>(`${process.env.API_URL}/claim/${id}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Failed to fetch claim:", error);
    return NextResponse.json(
      { error: "Failed to fetch claim" },
      { status: 500 }
    );
  }
}
