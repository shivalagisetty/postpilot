import { Lightbulb, Loader2, Sparkles, X } from 'lucide-react'
import { getPlatform, getTone } from '../lib/platforms'
import { aiMode } from '../services/aiService'
import { Button, Card, Label, Pill, PlatformBadge, Textarea } from './ui'

const TOPIC_IDEAS = [
  'Announcing our weekend discount',
  'Tips for morning routines',
  'Meet the team behind the brand',
  'A customer success story',
]

/** Topic input, platform selector and Generate button. */
export default function PostGenerator({
  profile,
  topic,
  onTopicChange,
  platformId,
  onPlatformChange,
  trend,
  onClearTrend,
  onGenerate,
  loading,
  error,
}) {
  const platform = getPlatform(platformId)
  const canGenerate = topic.trim().length > 2 && !loading

  const onSubmit = (event) => {
    event.preventDefault()
    if (canGenerate) onGenerate()
  }

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <Sparkles className="size-4 text-indigo-600" /> Generate a post
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Writing as a {getTone(profile.tone).label.toLowerCase()} {profile.businessType.toLowerCase()} for{' '}
            {profile.audience.toLowerCase()}.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
          {aiMode === 'openai' ? 'OpenAI' : 'Demo AI'}
        </span>
      </div>

      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div>
          <Label htmlFor="topic">Topic / goal</Label>
          <Textarea
            id="topic"
            rows={3}
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="e.g. Announcing our weekend discount"
            maxLength={300}
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {TOPIC_IDEAS.map((idea) => (
              <button
                key={idea}
                type="button"
                onClick={() => onTopicChange(idea)}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200"
              >
                {idea}
              </button>
            ))}
          </div>
        </div>

        {trend && (
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
            <Lightbulb className="mt-0.5 size-4 shrink-0" />
            <p className="min-w-0 flex-1">
              <span className="font-medium">Using trend:</span> {trend.title}
            </p>
            <button
              type="button"
              onClick={onClearTrend}
              aria-label="Remove trend"
              className="rounded p-0.5 text-amber-700 hover:bg-amber-100"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-slate-700">Platform</legend>
          <div className="flex flex-wrap gap-2">
            {profile.platforms.map((id) => (
              <Pill key={id} active={id === platformId} onClick={() => onPlatformChange(id)}>
                <PlatformBadge platformId={id} size="sm" />
                {getPlatform(id).name}
              </Pill>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">{platform.style}</p>
        </fieldset>

        {error && (
          <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}

        <Button type="submit" disabled={!canGenerate} className="w-full">
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {loading ? 'Writing your post…' : 'Generate post'}
        </Button>
      </form>
    </Card>
  )
}
