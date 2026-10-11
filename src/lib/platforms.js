export const PLATFORMS = [
  {
    id: 'instagram',
    name: 'Instagram',
    short: 'IG',
    badge: 'bg-gradient-to-br from-fuchsia-500 via-pink-500 to-amber-400',
    limit: 2200,
    hashtagCount: 8,
    aspect: 'aspect-[4/5]',
    aspectLabel: '4:5 portrait',
    style: 'Concise, visual and emoji-friendly with a strong hook and short lines.',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    short: 'in',
    badge: 'bg-sky-700',
    limit: 3000,
    hashtagCount: 4,
    aspect: 'aspect-[1.91/1]',
    aspectLabel: '1.91:1 landscape',
    style: 'Professional thought-leadership with a hook, short paragraphs and a closing question.',
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    short: 'X',
    badge: 'bg-neutral-900',
    limit: 280,
    hashtagCount: 2,
    aspect: 'aspect-video',
    aspectLabel: '16:9 landscape',
    style: 'Punchy and brief. Must fit within 280 characters including hashtags.',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    short: 'f',
    badge: 'bg-blue-600',
    limit: 63206,
    hashtagCount: 3,
    aspect: 'aspect-[1.91/1]',
    aspectLabel: '1.91:1 landscape',
    style: 'Friendly and conversational, community-focused, ending with a question.',
  },
]

export const TONES = [
  { id: 'professional', label: 'Professional', description: 'Polished, credible and clear' },
  { id: 'casual', label: 'Casual', description: 'Friendly and conversational' },
  { id: 'witty', label: 'Witty', description: 'Playful, clever and fun' },
  { id: 'inspirational', label: 'Inspirational', description: 'Uplifting and motivating' },
]

export const getPlatform = (id) => PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[0]
export const getTone = (id) => TONES.find((t) => t.id === id) ?? TONES[0]
