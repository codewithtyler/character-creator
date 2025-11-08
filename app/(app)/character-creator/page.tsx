'use client'

import { useState } from 'react'
import ImageUpload from '@/components/ImageUpload'
import ReferenceImageGrid from '@/components/ReferenceImageGrid'
import FeatureGate from '@/components/FeatureGate'

export type ReferenceImageState = {
  uploadedImage: string | null
  personDescription: string
  generatedImages: {
    angles: Record<string, string[]>
    outfits: Record<string, string[]>
    backgrounds: Record<string, string[]>
  }
  loading: boolean
  currentStep: 'upload' | 'generating' | 'complete'
}

export default function CharacterCreatorPage() {
  const [state, setState] = useState<ReferenceImageState>({
    uploadedImage: null,
    personDescription: '',
    generatedImages: {
      angles: {},
      outfits: {},
      backgrounds: {},
    },
    loading: false,
    currentStep: 'upload',
  })

  const handleImageUploaded = (imageUrl: string, description: string) => {
    setState(prev => ({
      ...prev,
      uploadedImage: imageUrl,
      personDescription: description,
      currentStep: 'generating',
    }))
  }

  const handleImagesGenerated = (images: ReferenceImageState['generatedImages']) => {
    setState(prev => ({
      ...prev,
      generatedImages: images,
      loading: false,
      currentStep: 'complete',
    }))
  }

  const handleLoadingChange = (loading: boolean) => {
    setState(prev => ({
      ...prev,
      loading,
    }))
  }

  const handleNewUpload = () => {
    setState({
      uploadedImage: null,
      personDescription: '',
      generatedImages: {
        angles: {},
        outfits: {},
        backgrounds: {},
      },
      loading: false,
      currentStep: 'upload',
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Character Creator
        </h1>
        <p className="text-purple-200">
          Upload a character image and generate reference images from all angles with different outfits and backgrounds
        </p>
      </div>

      <FeatureGate feature="character_creator">
        {state.currentStep === 'upload' ? (
          <ImageUpload
            onImageUploaded={handleImageUploaded}
            onLoadingChange={handleLoadingChange}
          />
        ) : (
          <ReferenceImageGrid
            uploadedImage={state.uploadedImage!}
            personDescription={state.personDescription}
            generatedImages={state.generatedImages}
            loading={state.loading}
            onImagesGenerated={handleImagesGenerated}
            onLoadingChange={handleLoadingChange}
            onNewUpload={handleNewUpload}
          />
        )}
      </FeatureGate>
    </div>
  )
}

