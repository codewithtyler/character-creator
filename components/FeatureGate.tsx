'use client'

import { useFeatureFlag } from '@/hooks/useFeatureFlag'

interface FeatureGateProps {
  feature: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function FeatureGate({
  feature,
  children,
  fallback = null,
}: FeatureGateProps) {
  const enabled = useFeatureFlag(feature)

  if (!enabled) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

