import { mockFetchTrends } from './mock/mockTrends'

/**
 * Search / trend research layer.
 *
 * Providers (set VITE_SEARCH_PROVIDER in .env):
 *   - "mock"   (default) simulated trend data, no network calls
 *   - "tavily" real web search through https://tavily.com (needs VITE_TAVILY_API_KEY)
 *
 * NOTE: Vite exposes VITE_* variables to the browser bundle. That is fine for a
 * local prototype, but for production put the call behind your own backend.
 *
 * Every provider resolves to an array of "trend" objects:
 *   { id, kind, title, summary, hook, tag, suggestedTopic, source, url }
 */

const PROVIDER = String(import.meta.env.VITE_SEARCH_PROVIDER ?? 'mock').toLowerCase()

export const searchMode = PROVIDER === 'tavily' ? 'tavily' : 'mock'

export async function fetchTrends({ businessType, audience }) {
  if (searchMode === 'tavily') return searchWithTavily({ businessType, audience })
  return mockFetchTrends({ businessType, audience })
}

async function searchWithTavily({ businessType, audience }) {
  const apiKey = import.meta.env.VITE_TAVILY_API_KEY
  if (!apiKey) {
    throw new Error('VITE_TAVILY_API_KEY is not set. Add it to your .env file or switch to the mock provider.')
  }

  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query: `latest social media marketing trends and viral content ideas for a ${businessType} targeting ${audience}`,
      max_results: 5,
      search_depth: 'basic',
    }),
  })

  if (!response.ok) throw new Error(`Web search failed (HTTP ${response.status}).`)

  const data = await response.json()
  const results = Array.isArray(data.results) ? data.results : []
  if (!results.length) throw new Error('The web search returned no results. Try again in a moment.')

  return results.map((result, index) => {
    let source = 'web'
    try {
      source = new URL(result.url).hostname.replace(/^www\./, '')
    } catch {
      // keep the default label
    }
    return {
      id: `tavily-${Date.now()}-${index}`,
      kind: 'Industry news',
      title: result.title ?? 'Untitled result',
      summary: String(result.content ?? '').slice(0, 200).trim(),
      hook: '',
      tag: '',
      suggestedTopic: result.title ?? '',
      source,
      url: result.url ?? '',
    }
  })
}
