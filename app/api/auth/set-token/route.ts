import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { setToken } from '@/lib/auth/token'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    await setToken(cookieStore, token)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to set token' },
      { status: 500 }
    )
  }
}

