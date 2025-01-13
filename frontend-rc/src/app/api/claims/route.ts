import { NextResponse } from "next/server";
import axios from "axios";
import { toCamelCase } from "@/app/utils/toCamelCase";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    console.log("API_URL from env:", process.env.API_URL);

    const response = await axios.get(`${process.env.API_URL}/claims`);
    const transformedData = toCamelCase(response.data);
    return NextResponse.json(transformedData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch claims" }, { status: 500 });
  }
}
