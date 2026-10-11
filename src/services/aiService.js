import { getPlatform, getTone } from '../lib/platforms'
import { normalizeHashtag, shuffle } from '../lib/utils'
import { buildImageIdeas, mockGenerate, mockHashtags } from './mock/mockAi'

/**
 * AI generation layer.
 *
 * Providers (set VITE_AI_PROVIDER in .env):
 *   - "mock"   (default) template based generator, no network calls
 *   - "openai" OpenAI Chat Completions (needs VITE_OPENAI_API_KEY, optional VITE_OPENAI_MODEL)
 *
 * NOTE: Vite exposes VITE_* variables to the browser bundle. That is fine for a
 * local prototype, but for production put the call behind your own backend.
 *
 * generatePost() always resolves to:
 *   { caption, hashtags: string[], imagePrompt, imageIdeas: string[] }
 */

const PROVIDER = String(import.meta.env.VITE_AI_PROVIDER ?? 'mock').toLowerCase()

export const aiMode = PROVIDER === 'openai' ? 'openai' : 'mock'

/** Normalises, de-duplicates and caps a list of hashtags. */
function tidyHashtags(list, max) {
  const seen = new Set()
  const result = []
  for (const item of list) {
    const tag = normalizeHashtag(item)
    const key = tag.toLowerCase()
    if (!tag || seen.has(key)) continue
    seen.add(key)
    result.push(tag)
  }
  return result.slice(0, max)
}

/** Makes sure caption + hashtags fit the platform's character limit. */
function fitToLimit(caption, hashtags, limit) {
  const block = (tags) => (tags.length ? 2 + tags.join(' ').length : 0)
  const tags = [...hashtags]
  while (tags.length && limit - block(tags) < Math.min(80, limit / 2)) tags.pop()

  const room = limit - block(tags)
  let text = caption.trim()
  if (text.length > room) {
    const cut = text.slice(0, room - 1)
    const lastSpace = cut.lastIndexOf(' ')
    text = `${(lastSpace > room * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
  }
  return { caption: text, hashtags: tags }
}

/** Builds the system + user messages sent to the LLM. */
export function buildPrompt({ profile, topic, platformId, trend }) {
  const platform = getPlatform(platformId)
  const tone = getTone(profile.tone)

  const system = [
    'You are an expert social media marketer who writes for small businesses.',
    'Reply with a single JSON object and nothing else, in this exact shape:',
    '{"caption": string, "hashtags": string[], "imagePrompt": string}',
    '"caption" is the post copy WITHOUT hashtags.',
    '"hashtags" is an array of relevant, high-reach hashtags that each start with #.',
    '"imagePrompt" is a detailed prompt for an AI image generator that fits the post.',
  ].join('\n')

  const user = [
    `Business type: ${profile.businessType}`,
    `Target audience: ${profile.audience}`,
    `Brand tone: ${tone.label} (${tone.description})`,
    `Platform: ${platform.name}. ${platform.style}`,
    `Hard limit: caption plus hashtags must be under ${platform.limit} characters.`,
    `Use about ${platform.hashtagCount} hashtags.`,
    `Image format: ${platform.aspectLabel}.`,
    `Post topic / goal: ${topic}`,
    trend ? `Work in this current trend or news angle: ${trend.title}. ${trend.summary}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  return { system, user }
}

async function generateWithOpenAI(input) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('VITE_OPENAI_API_KEY is not set. Add it to your .env file or switch to the mock provider.')
  }
  const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini'
  const { system, user } = buildPrompt(input)

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.8,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })

  if (!response.ok) throw new Error(`The AI request failed (HTTP ${response.status}).`)

  const data = await response.json()
  let parsed
  try {
    parsed = JSON.parse(data.choices?.[0]?.message?.content ?? '{}')
  } catch {
    throw new Error('The AI returned a response that could not be read. Please try again.')
  }
  if (!parsed.caption) throw new Error('The AI response was missing a caption. Please try again.')

  return {
    caption: String(parsed.caption),
    hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : [],
    imagePrompt: typeof parsed.imagePrompt === 'string' ? parsed.imagePrompt : '',
  }
}

/**
 * Generates a post for the given business profile, topic and platform.
 * @param {{ profile: object, topic: string, platformId: string, trend?: object|null }} input
 */
export async function generatePost(input) {
  const raw = aiMode === 'openai' ? await generateWithOpenAI(input) : await mockGenerate(input)
  const platform = getPlatform(input.platformId)

  const hashtagSource = raw.hashtags.length ? raw.hashtags : mockHashtags(input)
  const tags = tidyHashtags(hashtagSource, platform.hashtagCount)
  const { caption, hashtags } = fitToLimit(raw.caption, tags, platform.limit)

  const ideas = shuffle(buildImageIdeas(input))
  const imageIdeas = raw.imagePrompt ? [raw.imagePrompt, ...ideas.slice(0, 3)] : ideas

  return { caption, hashtags, imagePrompt: imageIdeas[0], imageIdeas }
}
