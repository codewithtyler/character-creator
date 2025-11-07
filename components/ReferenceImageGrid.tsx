'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface ReferenceImageGridProps {
  uploadedImage: string
  personDescription: string
  generatedImages: {
    angles: Record<string, string[]>
    outfits: Record<string, string[]>
    backgrounds: Record<string, string[]>
  }
  loading: boolean
  onImagesGenerated: (images: ReferenceImageGridProps['generatedImages']) => void
  onLoadingChange: (loading: boolean) => void
  onNewUpload: () => void
}

const angles = [
  { key: 'left45', label: 'Left 45°', angle: 'facing left at 45 degrees' },
  { key: 'right45', label: 'Right 45°', angle: 'facing right at 45 degrees' },
  { key: 'left90', label: 'Left 90°', angle: 'facing left at 90 degrees, profile view' },
  { key: 'right90', label: 'Right 90°', angle: 'facing right at 90 degrees, profile view' },
  { key: 'back180', label: 'Back 180°', angle: 'facing away, back of head visible' },
]

const outfits = [
  { key: 'casual', label: 'Casual Outfit', description: 'casual everyday clothing' },
  { key: 'formal', label: 'Formal Outfit', description: 'formal business or elegant attire' },
  { key: 'sporty', label: 'Sporty Outfit', description: 'athletic or sportswear' },
]

const backgrounds = [
  { key: 'studio', label: 'Studio', description: 'professional studio background, neutral lighting' },
  { key: 'outdoor', label: 'Outdoor', description: 'outdoor natural environment, daylight' },
  { key: 'indoor', label: 'Indoor', description: 'indoor room setting, warm lighting' },
]

export default function ReferenceImageGrid({
  uploadedImage,
  personDescription,
  generatedImages,
  loading,
  onImagesGenerated,
  onLoadingChange,
  onNewUpload,
}: ReferenceImageGridProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState('')

  useEffect(() => {
    if (Object.keys(generatedImages.angles).length === 0 && !isGenerating) {
      generateAllReferences()
    }
  }, [])

  const generateAllReferences = async () => {
    setIsGenerating(true)
    onLoadingChange(true)

    try {
      const allImages: ReferenceImageGridProps['generatedImages'] = {
        angles: {},
        outfits: {},
        backgrounds: {},
      }

      // Generate base angle views
      setGenerationProgress('Generating angle variations...')
      for (const angle of angles) {
        setGenerationProgress(`Generating ${angle.label}...`)
        const response = await fetch('/api/generate-variation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            baseImage: uploadedImage,
            personDescription,
            angle: angle.angle,
            variationType: 'angle',
          }),
        })

        if (!response.ok) throw new Error(`Failed to generate ${angle.label}`)
        const data = await response.json()
        allImages.angles[angle.key] = data.images
      }

      // Generate outfit variations (using front-facing as base)
      setGenerationProgress('Generating outfit variations...')
      for (const outfit of outfits) {
        setGenerationProgress(`Generating ${outfit.label}...`)
        const response = await fetch('/api/generate-variation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            baseImage: uploadedImage,
            personDescription,
            angle: 'facing forward, front view',
            outfit: outfit.description,
            variationType: 'outfit',
          }),
        })

        if (!response.ok) throw new Error(`Failed to generate ${outfit.label}`)
        const data = await response.json()
        allImages.outfits[outfit.key] = data.images
      }

      // Generate background variations (using front-facing as base)
      setGenerationProgress('Generating background variations...')
      for (const bg of backgrounds) {
        setGenerationProgress(`Generating ${bg.label} background...`)
        const response = await fetch('/api/generate-variation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            baseImage: uploadedImage,
            personDescription,
            angle: 'facing forward, front view',
            background: bg.description,
            variationType: 'background',
          }),
        })

        if (!response.ok) throw new Error(`Failed to generate ${bg.label} background`)
        const data = await response.json()
        allImages.backgrounds[bg.key] = data.images
      }

      onImagesGenerated(allImages)
    } catch (error) {
      console.error('Error generating references:', error)
      alert('Failed to generate reference images. Please try again.')
    } finally {
      setIsGenerating(false)
      onLoadingChange(false)
      setGenerationProgress('')
    }
  }

  const renderImageSection = (
    title: string,
    images: Record<string, string[]>,
    categories: typeof angles | typeof outfits | typeof backgrounds
  ) => {
    if (Object.keys(images).length === 0) return null

    return (
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-white mb-6">{title}</h3>
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryImages = images[category.key] || []
            if (categoryImages.length === 0) return null

            return (
              <div key={category.key} className="bg-white/5 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-purple-200 mb-4">
                  {category.label}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square bg-black/20 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={img}
                        alt={`${category.label} ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Reference Images Generated
            </h2>
            <p className="text-purple-200">
              LoRA training reference images from all angles
            </p>
          </div>
          <button
            onClick={onNewUpload}
            className="bg-white/20 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/30 transition-all duration-200 border border-white/30"
          >
            New Upload
          </button>
        </div>

        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              className="animate-spin h-12 w-12 text-purple-400 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-purple-200 text-lg mb-2">
              {generationProgress || 'Generating reference images...'}
            </p>
            <p className="text-purple-300 text-sm">
              This may take several minutes. Please be patient.
            </p>
          </div>
        ) : (
          <div>
            {/* Original Upload */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-white mb-6">Original Image</h3>
              <div className="relative w-full max-w-md aspect-square bg-black/20 rounded-lg overflow-hidden">
                <Image
                  src={uploadedImage}
                  alt="Original character"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>

            {/* Angle Variations */}
            {renderImageSection('Angle Variations', generatedImages.angles, angles)}

            {/* Outfit Variations */}
            {renderImageSection('Outfit Variations', generatedImages.outfits, outfits)}

            {/* Background Variations */}
            {renderImageSection('Background Variations', generatedImages.backgrounds, backgrounds)}
          </div>
        )}
      </div>
    </div>
  )
}

