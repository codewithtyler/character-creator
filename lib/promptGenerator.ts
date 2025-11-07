import { generateText } from 'ai'
import { createOllama } from 'ollama-ai-provider-v2'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'

type PromptInput = {
  personDescription?: string
  angle?: string
  outfit?: string
  background?: string
  variationType?: string
}

const DEFAULT_PERSON_DESCRIPTION = 'a person, portrait, high quality'

const ollama = createOllama({
  baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
})

const openRouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || '',
})

const ollamaModelName = process.env.OLLAMA_MODEL || 'llama3:instruct'
const openRouterModelName =
  process.env.OPENROUTER_MODEL || 'mistral/mixtral-8x7b-instruct'

const SYSTEM_PROMPT = `You are an expert AI prompt engineer for Stable Diffusion XL image-to-image tasks.
Create highly detailed prompts that strictly maintain the original person's face and identity.
The prompt must include: camera angle, pose, body orientation, outfit pieces with colors/fabrics, background elements, lighting, mood, and framing.
Explicitly forbid changing ethnicity, facial structure, or unique features.
Explicitly describe hand position and fingers to avoid deformations.
Explicitly forbid repeating the same pink shirt unless the user requested it.
Use confident, explicit language like "wearing", "standing", "background".
Return only the final prompt string with no additional commentary, labels, or formatting.`

function buildUserPrompt({
  personDescription,
  angle,
  outfit,
  background,
}: PromptInput) {
  const cleanDescription =
    personDescription &&
    personDescription.trim().length > 0 &&
    personDescription !== DEFAULT_PERSON_DESCRIPTION
      ? personDescription.trim()
      : 'A young woman with long wavy brunette hair, warm fair skin, soft glam makeup, and confident expression.'

  return `ORIGINAL PERSON DESCRIPTION:
${cleanDescription}

REQUIRED ANGLE OR POSE:
${angle || 'front facing'}

REQUESTED OUTFIT STYLE:
${outfit || 'same as original image'}

REQUESTED BACKGROUND:
${background || 'same as original image'}

MANDATORY CONSTRAINTS:
- Same person, same face, same hair color and length, same ethnicity
- Hands and fingers must be anatomically correct, relaxed, no distortions
- Avoid pink button-up shirt unless requested
- If outfit or background is specified, make it visually obvious and coherent
- Describe lighting, mood, and composition
- Provide extra descriptive adjectives for fabrics, colors, and environment

Return a single descriptive sentence suitable for Stable Diffusion.`
}

function sanitizePrompt(text: string) {
  const trimmed = text.trim()
  const withoutLabel = trimmed.replace(/^prompt\s*[:=-]*\s*/i, '')
  return withoutLabel.replace(/\s+/g, ' ').trim()
}

function buildFallbackPrompt({
  personDescription,
  angle,
  outfit,
  background,
}: PromptInput) {
  const fragments: string[] = []

  fragments.push(
    'same person, same face, same distinctive features, photorealistic portrait, long wavy dark brown hair, warm fair skin, confident expression'
  )

  if (angle) {
    fragments.push(`${angle}, body oriented accordingly, head aligned naturally`)
  }

  if (outfit) {
    if (/sporty|athletic/i.test(outfit)) {
      fragments.push(
        'wearing athletic outfit, fitted sports bra, high-waisted performance leggings, lightweight zip jacket tied at waist, breathable technical fabric'
      )
    } else if (/formal|elegant/i.test(outfit)) {
      fragments.push(
        'wearing elegant formal dress, satin fabric, tailored silhouette, tasteful jewelry, dressy heels'
      )
    } else if (/casual/i.test(outfit)) {
      fragments.push(
        'wearing casual streetwear: fitted crew neck tee, light cardigan, relaxed jeans'
      )
    } else {
      fragments.push(`wearing ${outfit}`)
    }
  } else {
    fragments.push(
      'wearing stylish modern outfit that complements complexion, avoiding pink button-up shirts'
    )
  }

  if (background) {
    if (/outdoor/i.test(background)) {
      fragments.push(
        'outdoor cinematic backdrop, soft afternoon sunlight, shallow depth of field, hints of greenery and city textures'
      )
    } else if (/studio/i.test(background)) {
      fragments.push(
        'professional photography studio background, neutral seamless backdrop, controlled softbox lighting'
      )
    } else {
      fragments.push(`background ${background}`)
    }
  } else {
    fragments.push(
      'background refreshed to complement outfit, soft bokeh, no bedroom furniture'
    )
  }

  fragments.push(
    'hands relaxed at sides or resting on hips, fingers naturally posed, no distortions, cinematic lighting, 85mm lens portrait composition, ultra high resolution'
  )

  if (personDescription && personDescription !== DEFAULT_PERSON_DESCRIPTION) {
    fragments.push(personDescription)
  }

  return fragments.join(', ')
}

export async function buildGenerationPrompt(input: PromptInput) {
  const userPrompt = buildUserPrompt(input)

  const ollamaModel = ollamaModelName
  const openRouterModel = openRouterModelName

  if (process.env.OLLAMA_BASE_URL) {
    try {
      const { text } = await generateText({
        model: ollama(ollamaModel),
        system: SYSTEM_PROMPT,
        prompt: userPrompt,
      })
      if (text) {
        return sanitizePrompt(text)
      }
    } catch (error) {
      console.warn('Ollama prompt generation failed, falling back to OpenRouter', error)
    }
  }

  if (process.env.OPENROUTER_API_KEY) {
    try {
      const { text } = await generateText({
        model: openRouter(openRouterModel),
        system: SYSTEM_PROMPT,
        prompt: userPrompt,
      })
      if (text) {
        return sanitizePrompt(text)
      }
    } catch (error) {
      console.warn('OpenRouter prompt generation failed, using fallback', error)
    }
  }

  return sanitizePrompt(buildFallbackPrompt(input))
}

