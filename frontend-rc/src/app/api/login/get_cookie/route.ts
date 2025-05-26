import { NextResponse } from 'next/server';
import { cookies }    from 'next/headers';
import { jwtVerify }  from 'jose';

export async function GET() {
  const token = (await cookies()).get('rd_admin_token')?.value;
  if (!token) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    return NextResponse.json(
      { authenticated: true, ...payload }
    );
  } catch {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}
