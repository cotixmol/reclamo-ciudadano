import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_PATHS = ['/claims', '/admin/login', '/favicon.ico', '/api/admin/login']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // allow truly public pages
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  const needsAuth =
    pathname.startsWith('/admin/') || pathname.startsWith('/api/admin/')
  if (!needsAuth) {
    return NextResponse.next()
  }

  const token = req.cookies.get('rd_admin_token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!))
    return NextResponse.next()
  } catch {
    const res = NextResponse.redirect(new URL('/admin/login', req.url))
    res.cookies.delete('rd_admin_token')
    return res
  }
}

export const config = {
  matcher: ['/claims/:path*', '/admin/:path*', '/api/admin/:path*'],
}
