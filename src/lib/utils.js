export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const pick = (items) => items[Math.floor(Math.random() * items.length)]

/** Lower-cases text for mid-sentence use, but keeps acronyms like "SaaS" or "B2B" intact. */
export const lower = (s) => (/[A-Z]{2,}/.test(s) ? s : s.toLowerCase())

export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

/** Trims whitespace and trailing punctuation. */
export const clean = (s) => String(s ?? '').trim().replace(/[.!?\s]+$/, '')

export function shuffle(items) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/** Turns any text into a clean "#Hashtag" (empty string if nothing usable). */
export function normalizeHashtag(value) {
  const cleaned = String(value ?? '').replace(/[^\p{L}\p{N}_]/gu, '')
  return cleaned ? `#${cleaned}` : ''
}

/** "Coffee Shop" -> "#CoffeeShop", "Gen-Z fitness" -> "#GenZFitness" */
export function toTag(text) {
  const words = String(text ?? '')
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
  return words.length ? `#${words.join('')}` : ''
}

export function formatDateTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
}

/** Date -> value usable by <input type="datetime-local"> (local time). */
export function toLocalInput(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fall through to legacy approach
  }
  try {
    const el = document.createElement('textarea')
    el.value = text
    el.setAttribute('readonly', '')
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(el)
    return ok
  } catch {
    return false
  }
}

/** Character count of caption plus the hashtag block, as it would be posted. */
export function postLength(post) {
  return post.caption.length + (post.hashtags.length ? 2 + post.hashtags.join(' ').length : 0)
}

export function postToText(post) {
  const tags = (post.hashtags ?? []).join(' ')
  return tags ? `${post.caption}\n\n${tags}` : post.caption
}
