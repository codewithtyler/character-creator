import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { deleteToken } from '@/lib/auth/token'

export async function POST() {
  try {
    const cookieStore = await cookies()
    await deleteToken(cookieStore)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to logout' },
      { status: 500 }
    )
  }
}

