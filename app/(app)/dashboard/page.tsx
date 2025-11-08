'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Feature {
  name: string
  description: string
  enabled: boolean
  route?: string
}

export default function DashboardPage() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFeatures() {
      try {
        const featureNames = [
          'character_creator',
          'text_to_image',
          'scheduling',
          'image_editing',
          'video_generation',
          'analytics',
        ]

        const featureData = await Promise.all(
          featureNames.map(async (name) => {
            try {
              const response = await fetch(`/api/features/${name}`)
              if (response.ok) {
                const data = await response.json()
                return {
                  name,
                  description: getFeatureDescription(name),
                  enabled: data.enabled,
                  route: getFeatureRoute(name),
                }
              }
            } catch {
              // Feature check failed
            }
            return {
              name,
              description: getFeatureDescription(name),
              enabled: false,
              route: getFeatureRoute(name),
            }
          })
        )

        setFeatures(featureData)
      } catch (error) {
        console.error('Failed to load features:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFeatures()
  }, [])

  function getFeatureDescription(name: string): string {
    const descriptions: Record<string, string> = {
      character_creator: 'Character creation with LoRA',
      text_to_image: 'Text-to-image generation',
      scheduling: 'Blotato scheduling integration',
      image_editing: 'Image-to-image editing',
      video_generation: 'Video generation with SkyReels',
      analytics: 'Advanced analytics dashboard',
    }
    return descriptions[name] || name
  }

  function getFeatureRoute(name: string): string | undefined {
    const routes: Record<string, string> = {
      character_creator: '/character-creator',
    }
    return routes[name]
  }

  function formatFeatureName(name: string): string {
    return name
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-white text-lg">Loading features...</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col container mx-auto px-4 py-4">
      <div className="mb-4 flex-shrink-0">
        <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-purple-200 text-sm">
          Welcome! Manage your content creation workflow.
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
        {features.map((feature) => (
          <div
            key={feature.name}
            className={`bg-white/10 backdrop-blur-lg rounded-xl p-4 flex flex-col ${
              !feature.enabled ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">
                {formatFeatureName(feature.name)}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  feature.enabled
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-gray-500/20 text-gray-300'
                }`}
              >
                {feature.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <p className="text-purple-200 text-sm mb-3 flex-1">{feature.description}</p>
            {feature.enabled && feature.route ? (
              <Link
                href={feature.route}
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-1.5 px-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 text-sm"
              >
                Get Started
              </Link>
            ) : (
              <button
                disabled
                className="bg-gray-500/20 text-gray-400 font-semibold py-1.5 px-3 rounded-lg cursor-not-allowed text-sm"
              >
                Coming Soon
              </button>
            )}
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

