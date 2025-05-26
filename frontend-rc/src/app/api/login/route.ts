import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import axios from 'axios'

const headersConfig = {
  'x-api-key': process.env.API_KEY || '',
  'x-client-name': process.env.API_CLIENT_NAME || '',
}
const BACKEND_URL = process.env.API_URL || ''

export async function POST(req: Request) {
  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'missingCredentials' }, { status: 400 })
  }
  const backend = await axios.post(
    `${BACKEND_URL}/admin/login`,
    { email, password },
    { headers: headersConfig, validateStatus: () => true },
  )

  if (backend.status !== 200) {
    return NextResponse.json({ error: 'invalidCredentials' }, { status: 401 })
  }
  const { token } = backend.data as { token: string }
  ;(await cookies()).set({
    name: 'rd_admin_token',
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60,
    path: '/',
  })

  return NextResponse.json({ ok: true })
}
