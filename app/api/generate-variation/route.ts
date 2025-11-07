import { NextRequest, NextResponse } from 'next/server'
import { buildGenerationPrompt } from '@/lib/promptGenerator'

export async function POST(request: NextRequest) {
  try {
    const { baseImage, personDescription, angle, outfit, background, variationType } = await request.json()

    if (!baseImage) {
      return NextResponse.json(
        { error: 'Base image is required' },
        { status: 400 }
      )
    }

    const generatedPrompt = await buildGenerationPrompt({
      personDescription,
      angle,
      outfit,
      background,
      variationType,
    })

    const prompt = `${generatedPrompt}, ultra detailed, 8k portrait photography, award-winning photo, realistic skin texture, carefully styled hair`

    // Negative prompt to avoid unwanted elements
    const negativePrompt =
      'blurry, low quality, distorted, deformed, extra limbs, bad anatomy, deformed hands, extra fingers, missing fingers, backwards thumb, bad hands, inconsistent face, different person, watermark, text, signature, pink button up shirt, identical bedroom background'

    // Use Automatic1111 WebUI API
    const sdApiUrl = process.env.STABLE_DIFFUSION_API_URL || 'http://localhost:7860'

    const base64Data = baseImage.includes(',') ? baseImage.split(',')[1] : baseImage

    let denoisingStrength = 0.75
    if (variationType === 'outfit' || variationType === 'background') {
      denoisingStrength = 0.85
    } else if (variationType === 'angle') {
      denoisingStrength = 0.78
    }

    const generateImage = async () => {
      const response = await fetch(`${sdApiUrl}/sdapi/v1/img2img`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          negative_prompt: negativePrompt,
          init_images: [base64Data],
          steps: 30,
          cfg_scale: 7.5,
          denoising_strength: denoisingStrength,
          sampler_name: 'Euler',
          width: 1024,
          height: 1024,
        }),
      })

      if (!response.ok) {
        throw new Error(`Stable Diffusion API error: ${response.statusText}`)
      }

      const data = await response.json()
      const imageBase64 = data.images?.[0] || null
      if (!imageBase64) {
        throw new Error('Stable Diffusion response did not include an image')
      }

      if (imageBase64.startsWith('data:')) {
        return imageBase64
      }

      return `data:image/png;base64,${imageBase64}`
    }

    const imagePromises = Array.from({ length: 2 }, () =>
      generateImage().catch((error) => {
        console.error('Error generating single image:', error)
        return null
      })
    )

    const images = (await Promise.all(imagePromises)).filter(Boolean) as string[]

    if (images.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate images. Make sure Automatic1111 WebUI is running and accessible.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ images })
  } catch (error: any) {
    console.error('Error generating variation:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate variation' },
      { status: 500 }
    )
  }
}
