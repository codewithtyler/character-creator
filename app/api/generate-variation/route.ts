import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { baseImage, personDescription, angle, outfit, background, variationType } = await request.json()

    if (!baseImage) {
      return NextResponse.json(
        { error: 'Base image is required' },
        { status: 400 }
      )
    }

    // Build the prompt based on variation type
    let prompt = personDescription || 'a person'

    if (angle) {
      prompt += `, ${angle}`
    }

    if (outfit) {
      prompt += `, wearing ${outfit}`
    }

    if (background) {
      prompt += `, ${background}`
    }

    prompt += ', high quality portrait photography, professional lighting, detailed, 8k resolution, consistent character appearance, photorealistic'

    // Negative prompt to avoid unwanted elements
    const negativePrompt = 'blurry, low quality, distorted, deformed, extra limbs, bad anatomy, watermark, text, signature'

    // Use Automatic1111 WebUI API
    const sdApiUrl = process.env.STABLE_DIFFUSION_API_URL || 'http://localhost:7860'

    // Generate 2 variations for each category
    const imagePromises = Array.from({ length: 2 }, async () => {
      try {
        // Convert base64 data URL to base64 string
        const base64Data = baseImage.includes(',') ? baseImage.split(',')[1] : baseImage

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
            denoising_strength: 0.7, // Balance between original and new
            sampler_name: 'Euler',
            width: 1024,
            height: 1024,
          }),
        })

        if (!response.ok) {
          throw new Error(`Stable Diffusion API error: ${response.statusText}`)
        }

        const data = await response.json()
        const imageUrl = data.images?.[0] || null

        return imageUrl
      } catch (error) {
        console.error('Error generating single image:', error)
        return null
      }
    })

    const images = (await Promise.all(imagePromises)).filter(Boolean) as string[]

    if (images.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate images. Make sure Automatic1111 WebUI is running and accessible.' },
        { status: 500 }
      )
    }

    // Convert base64 to data URLs
    const formattedImages = images.map(img => {
      if (img.startsWith('data:')) return img
      return `data:image/png;base64,${img}`
    })

    return NextResponse.json({ images: formattedImages })
  } catch (error: any) {
    console.error('Error generating variation:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate variation' },
      { status: 500 }
    )
  }
}
