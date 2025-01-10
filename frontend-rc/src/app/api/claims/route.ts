import { NextResponse } from "next/server";
import axios from "axios";
import { toCamelCase } from "@/app/utils/toCamelCase";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const response = await axios.get(`${process.env.API_URL}/claims`);
    const transformedData = toCamelCase(response.data); // Transform to camelCase
    return NextResponse.json(transformedData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch claims" }, { status: 500 });
  }
}
