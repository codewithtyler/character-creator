import { NextRequest, NextResponse } from 'next/server'
import { buildVisionDescription } from '@/lib/visionDescription'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Convert file to base64 data URL for use in image-to-image generation
    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Image = buffer.toString('base64')
    const dataUrl = `data:${imageFile.type};base64,${base64Image}`

    const description = await buildVisionDescription({
      imageBase64: dataUrl,
    })

    return NextResponse.json({
      imageUrl: dataUrl,
      description: description.trim(),
    })
  } catch (error: any) {
    console.error('Error processing image:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process image' },
      { status: 500 }
    )
  }
}
