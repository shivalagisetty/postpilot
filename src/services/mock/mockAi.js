import { getPlatform } from '../../lib/platforms'
import { cap, clean, delay, lower, pick, toTag } from '../../lib/utils'

const HOOKS = {
  professional: [
    "Here's what matters most right now.",
    'A quick update from our team.',
    'Insight worth sharing with our community.',
  ],
  casual: ['Hey friends! 👋', 'Quick one for you today:', 'Okay, real talk:'],
  witty: ['Plot twist:', 'Breaking (very important) news:', 'We tried to play it cool. We failed.'],
  inspirational: [
    'Every big thing starts small.',
    'Today is a great day to begin.',
    'Your next chapter starts with one step.',
  ],
}

const VALUE = {
  professional: (biz, aud) =>
    `At our ${biz}, we focus on delivering real value to ${aud}, consistently and without compromise.`,
  casual: (biz, aud) => `We're a ${biz} and we love helping ${aud}. Seriously, it's the best part of what we do.`,
  witty: (biz, aud) => `Being a ${biz} for ${aud} is basically our superpower (and our full-time job).`,
  inspirational: (biz, aud) => `We built our ${biz} to help ${aud} reach further than they thought possible.`,
}

const CTAS = {
  instagram: ["Tap save so you don't forget 📌", 'Tag a friend who needs this 👇', "Drop a ❤️ if you're in!"],
  linkedin: [
    "What's your take? Share your thoughts in the comments.",
    "How is your team approaching this? I'd love to hear.",
    "Agree or disagree? Let's discuss.",
  ],
  twitter: ['Thoughts? 👇', 'Repost if you agree.', 'Reply with your take.'],
  facebook: [
    "Tell us in the comments. We'd love to hear from you!",
    "Share this with someone who'd love it 💙",
    'What would you like to see from us next?',
  ],
}

const GENERIC_TAGS = {
  instagram: ['#SmallBusiness', '#SupportLocal', '#ShopSmall', '#Entrepreneur', '#InstaGood', '#ContentCreator'],
  linkedin: ['#SmallBusiness', '#Marketing', '#Leadership', '#Growth'],
  twitter: ['#SmallBiz', '#Marketing'],
  facebook: ['#SmallBusiness', '#SupportLocal', '#Community'],
}

const STOP_WORDS = new Set([
  'announcing',
  'about',
  'from',
  'with',
  'your',
  'this',
  'that',
  'what',
  'have',
  'more',
  'best',
  'tips',
  'share',
  'introduce',
  'quick',
  'three',
])

export function mockHashtags({ profile, topic, platformId, trend }) {
  const topicTags = clean(topic)
    .split(/\s+/)
    .filter((word) => word.length > 4 && !STOP_WORDS.has(word.toLowerCase()))
    .slice(0, 2)
    .map((word) => toTag(word))
  const audienceTag = toTag(clean(profile.audience).split(/\s+/).slice(0, 2).join(' '))

  return [toTag(profile.businessType), trend?.tag, ...topicTags, audienceTag, ...(GENERIC_TAGS[platformId] ?? [])]
}

/** Image prompts used by every provider as swap-in alternatives. */
export function buildImageIdeas({ profile, topic, platformId }) {
  const platform = getPlatform(platformId)
  const biz = lower(clean(profile.businessType))
  const aud = lower(clean(profile.audience))
  const subject = clean(topic)
  const format = `Format: ${platform.aspectLabel} for ${platform.name}.`

  return [
    `Bright, natural-light flat-lay photo that showcases "${subject}" for a ${biz}, clean background, brand-friendly colors, room for a short text overlay. ${format}`,
    `Candid lifestyle photo of ${aud} enjoying the ${biz} experience, warm tones, shallow depth of field, authentic and unposed. ${format}`,
    `Bold typographic graphic with the headline "${cap(subject)}", high-contrast brand colors, minimal icons, modern flat design. ${format}`,
    `Behind-the-scenes shot of the ${biz} team at work, genuine smiles, slightly imperfect framing, documentary feel. ${format}`,
  ]
}

/** Template-based generator that mimics an LLM response. */
export async function mockGenerate({ profile, topic, platformId, trend }) {
  await delay(900 + Math.random() * 600)

  const biz = lower(clean(profile.businessType))
  const aud = lower(clean(profile.audience))
  const headline = cap(clean(topic))
  const hook = pick(HOOKS[profile.tone] ?? HOOKS.professional)
  const value = (VALUE[profile.tone] ?? VALUE.professional)(biz, aud)
  const trendLine = trend ? `Inspired by what's trending: ${clean(trend.title)}.` : ''
  const cta = pick(CTAS[platformId] ?? CTAS.facebook)

  let caption
  switch (platformId) {
    case 'instagram':
      caption = [hook, `✨ ${headline} ✨`, value, trendLine, cta].filter(Boolean).join('\n\n')
      break
    case 'twitter':
      caption = `${hook} ${headline}. ${cta}`
      break
    default:
      caption = [hook, `${headline}.`, value, trendLine, cta].filter(Boolean).join('\n\n')
  }

  return {
    caption,
    hashtags: mockHashtags({ profile, topic, platformId, trend }),
    imagePrompt: '',
  }
}
