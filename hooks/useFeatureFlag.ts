'use client'

import { useState, useEffect } from 'react'

export function useFeatureFlag(featureName: string): boolean {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    async function checkFeature() {
      try {
        const response = await fetch(`/api/features/${featureName}`)
        if (response.ok) {
          const data = await response.json()
          setEnabled(data.enabled === true)
        }
      } catch (error) {
        // Feature check failed - default to disabled
        setEnabled(false)
      }
    }

    checkFeature()
  }, [featureName])

  return enabled
}

