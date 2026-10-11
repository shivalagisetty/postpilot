import { ExternalLink, Flame, Globe, Loader2, Newspaper, Sparkles, TrendingUp } from 'lucide-react'
import { cn } from '../lib/utils'
import { searchMode } from '../services/searchService'
import { Button, Card } from './ui'

const KIND_ICONS = {
  'Trending format': TrendingUp,
  'Viral hook': Flame,
  'Industry news': Newspaper,
}

/** "Fetch Trending Topics & Inspiration" — shows research results and lets the user pick one. */
export default function TrendsPanel({ trends, loading, error, selectedId, onFetch, onSelect }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <Globe className="size-4 text-indigo-600" /> Research
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Find what&apos;s trending in your niche, then build a post around it.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
          {searchMode === 'tavily' ? 'Live web search' : 'Simulated'}
        </span>
      </div>

      <Button onClick={onFetch} disabled={loading} className="mt-4 w-full" variant="secondary">
        {loading ? <Loader2 className="size-4 animate-spin" /> : <TrendingUp className="size-4" />}
        {loading ? 'Searching the web…' : 'Fetch Trending Topics & Inspiration'}
      </Button>

      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      {trends.length > 0 && (
        <ul className="mt-4 space-y-2">
          {trends.map((trend) => {
            const Icon = KIND_ICONS[trend.kind] ?? Sparkles
            const selected = trend.id === selectedId
            return (
              <li key={trend.id}>
                <div
                  className={cn(
                    'rounded-lg border p-3 transition-colors',
                    selected ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600' : 'border-slate-200',
                  )}
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-indigo-600 uppercase">
                    <Icon className="size-3.5" /> {trend.kind}
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-900">{trend.title}</p>
                  {trend.summary && <p className="mt-1 text-xs leading-relaxed text-slate-500">{trend.summary}</p>}
                  {trend.hook && (
                    <p className="mt-1.5 text-xs text-slate-600">
                      <span className="font-medium">Hook idea:</span> {trend.hook}
                    </p>
                  )}
                  <div className="mt-2 flex items-center justify-between gap-2">
                    {trend.url ? (
                      <a
                        href={trend.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600"
                      >
                        {trend.source} <ExternalLink className="size-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">{trend.source}</span>
                    )}
                    <Button
                      size="sm"
                      variant={selected ? 'primary' : 'secondary'}
                      onClick={() => onSelect(selected ? null : trend)}
                    >
                      {selected ? 'Selected' : 'Use this idea'}
                    </Button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
