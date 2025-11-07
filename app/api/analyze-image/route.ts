import { NextRequest, NextResponse } from 'next/server'

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

    // Basic description - Stable Diffusion img2img will use the image directly
    // The description is just for the prompt variations
    const description = 'a person, portrait, high quality'

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
