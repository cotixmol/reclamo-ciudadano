import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { toCamelCase } from "@/app/utils/toCamelCase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await axios.post(
      `${process.env.API_URL}/claims`,
      body
    );
    const transformedData = toCamelCase(response.data);
    return NextResponse.json(transformedData, { status: 200 });
  } catch (error) {
    console.error("Error fetching claims:", error);
    return NextResponse.json({ error: error || "Unexpected error" }, { status: 500 });
  }
}
