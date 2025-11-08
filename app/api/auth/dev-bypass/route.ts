import { NextResponse } from 'next/server'
import { createDevBypassToken } from '@/lib/auth/devBypass'

export async function POST() {
  try {
    await createDevBypassToken()
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create bypass token' },
      { status: 500 }
    )
  }
}

