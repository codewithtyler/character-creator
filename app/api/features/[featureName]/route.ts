import { NextRequest, NextResponse } from 'next/server'
import { checkFeature } from '@/lib/features/checkFeature'

export async function GET(
  request: NextRequest,
  { params }: { params: { featureName: string } }
) {
  const featureName = params.featureName
  const enabled = await checkFeature(featureName)

  return NextResponse.json({ enabled })
}

