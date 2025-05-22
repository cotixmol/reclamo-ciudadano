import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = ['/pages/claims', '/pages/admin/login', '/favicon.ico'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // allow public routes straight through
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next();

  // protect only /pages/admin/* and /api/admin/*
  const needsAuth =
    pathname.startsWith('/pages/admin/') || pathname.startsWith('/api/admin/');
  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get('rd_admin_token')?.value;
  if (!token) return NextResponse.redirect(new URL('/pages/admin/login', req.url));

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL('/pages/admin/login', req.url));
    res.cookies.delete('rd_admin_token');
    return res;
  }
}

export const config = {
  matcher: ['/pages/admin/:path*', '/api/admin/:path*', '/pages/claims/:path*'],
};
