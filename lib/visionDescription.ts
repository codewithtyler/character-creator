import { generateText } from 'ai'
import { createOllama } from 'ollama-ai-provider-v2'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'

type VisionInput = {
  imageBase64: string
}

const DEFAULT_DESCRIPTION =
  'a person, portrait, high quality, same face, same character'

const ollama = createOllama({
  baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
})

const openRouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || '',
})

const VISION_SYSTEM_PROMPT = `You are a computer vision analyst who writes detailed prompts for image generation models.
You must describe the person in the photo with meticulous detail including:
- facial features, expression, ethnicity, age range, skin tone, makeup
- hair color, style, length, texture
- clothing items, fabrics, colors, patterns, accessories
- body pose, orientation, visible limbs, hand placement, finger positioning
- lighting, environment, background elements, mood
- any objects, props, or furniture in the scene
- details to avoid changing (e.g., distinguishing marks, key accessories)
Make the description suitable for use in a Stable Diffusion prompt. Keep it as one paragraph.`

function buildVisionPrompt(imageBase64: string) {
  return {
    type: 'input_text' as const,
    text: 'Analyze this image carefully and describe the person as detailed as possible for image generation.',
    image: imageBase64,
  }
}

function sanitize(text?: string) {
  if (!text) return DEFAULT_DESCRIPTION
  return text.trim().replace(/\s+/g, ' ')
}

export async function buildVisionDescription({
  imageBase64,
}: VisionInput): Promise<string> {
  const payload = buildVisionPrompt(imageBase64)

  if (process.env.OLLAMA_BASE_URL) {
    try {
      const { text } = await generateText({
        model: ollama(process.env.OLLAMA_VISION_MODEL || 'llama3.2-vision:11b'),
        system: VISION_SYSTEM_PROMPT,
        messages: [payload],
      })
      const sanitized = sanitize(text)
      if (sanitized && sanitized !== '') {
        return sanitized
      }
    } catch (error) {
      console.warn('Ollama vision description failed, trying OpenRouter', error)
    }
  }

  if (process.env.OPENROUTER_API_KEY) {
    try {
      const { text } = await generateText({
        model: openRouter(
          process.env.OPENROUTER_VISION_MODEL ||
            'meta-llama/llama-3.2-11b-vision-instruct'
        ),
        system: VISION_SYSTEM_PROMPT,
        messages: [payload],
      })
      const sanitized = sanitize(text)
      if (sanitized && sanitized !== '') {
        return sanitized
      }
    } catch (error) {
      console.warn('OpenRouter vision description failed, using fallback', error)
    }
  }

  return DEFAULT_DESCRIPTION
}

