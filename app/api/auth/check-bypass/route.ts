import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getToken } from '@/lib/auth/token'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const tokenData = await getToken(cookieStore)

    if (!tokenData) {
      return NextResponse.json({ isBypass: false })
    }

    // Check if token starts with dev-bypass prefix
    const isBypass = tokenData.token.startsWith('dev-bypass-token-')

    return NextResponse.json({ isBypass })
  } catch (error) {
    return NextResponse.json({ isBypass: false })
  }
}

