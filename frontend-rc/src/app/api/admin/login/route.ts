import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

const headersConfig = {
  'x-api-key': process.env.API_KEY || '',
  'x-client-name': process.env.API_CLIENT_NAME || '',
};

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'missingCredentials' },
        { status: 400 }
      );
    }

    // Forward to FastAPI (or whatever) auth endpoint
    const backend = await axios.post(
      `${process.env.API_URL}/admin/auth/login`,
      { email, password },
      {
        headers: headersConfig,
        validateStatus: () => true,                
      }
    );

    if (backend.status !== 200) {
      return NextResponse.json(
        { error: 'invalidCredentials' },
        { status: backend.status }
      );
    }

    const { token } = backend.data as { token: string };

    (await cookies()).set({
      name: 'rd_admin_token',
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60,      // 1 h
      path: '/',
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'unexpected' },
      { status: 500 }
    );
  }
}
