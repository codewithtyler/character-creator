'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string, description: string) => void
  onLoadingChange: (loading: boolean) => void
}

export default function ImageUpload({
  onImageUploaded,
  onLoadingChange,
}: ImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setPreviewUrl(result)
      setSelectedImage(result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedImage || isProcessing) return

    setIsProcessing(true)
    onLoadingChange(true)

    try {
      // Convert data URL to blob
      const response = await fetch(selectedImage)
      const blob = await response.blob()

      // Upload to our API
      const formData = new FormData()
      formData.append('image', blob, 'character.jpg')

      const uploadResponse = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to analyze image')
      }

      const data = await uploadResponse.json()
      onImageUploaded(data.imageUrl, data.description)
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Failed to process image. Please try again.')
    } finally {
      setIsProcessing(false)
      onLoadingChange(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreviewUrl(result)
        setSelectedImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Upload Character Image
        </h2>
        <p className="text-purple-200 mb-6">
          Upload an image of a person facing forward. We'll generate reference images from different angles, with various outfits and backgrounds for LoRA training.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <div className="relative w-full max-w-md mx-auto aspect-square mb-4">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain rounded-lg"
                  unoptimized
                />
              </div>
            ) : (
              <div className="py-12">
                <svg
                  className="mx-auto h-12 w-12 text-purple-400 mb-4"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-white mb-2">Click to upload or drag and drop</p>
                <p className="text-purple-300 text-sm">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {previewUrl && (
            <button
              type="button"
              onClick={() => {
                setPreviewUrl(null)
                setSelectedImage(null)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }}
              className="w-full bg-white/10 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/30"
            >
              Remove Image
            </button>
          )}

          <button
            type="submit"
            disabled={!selectedImage || isProcessing}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Analyzing Image...
              </span>
            ) : (
              'Analyze & Generate References'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

