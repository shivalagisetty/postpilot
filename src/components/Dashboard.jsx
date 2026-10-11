import { useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useApp } from '../context/appContextValue'
import { copyText, postToText } from '../lib/utils'
import { generatePost } from '../services/aiService'
import { fetchTrends } from '../services/searchService'
import DraftReview from './DraftReview'
import PostGenerator from './PostGenerator'
import ScheduleModal from './ScheduleModal'
import TrendsPanel from './TrendsPanel'
import { Card } from './ui'

const errorMessage = (error) => (error instanceof Error ? error.message : 'Something went wrong. Please try again.')

export default function Dashboard({ onViewHistory }) {
  const { profile, addPost, notify } = useApp()

  const [topic, setTopic] = useState('')
  const [platformId, setPlatformId] = useState(profile.platforms[0])
  const [trend, setTrend] = useState(null)

  const [trends, setTrends] = useState([])
  const [trendsLoading, setTrendsLoading] = useState(false)
  const [trendsError, setTrendsError] = useState('')

  const [draft, setDraft] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [generateError, setGenerateError] = useState('')
  const [scheduling, setScheduling] = useState(false)

  // Guards against slow responses overwriting newer results.
  const generationRun = useRef(0)

  // The profile can change while the dashboard is mounted (platforms removed).
  const activePlatform = profile.platforms.includes(platformId) ? platformId : profile.platforms[0]

  const handleFetchTrends = async () => {
    setTrendsLoading(true)
    setTrendsError('')
    try {
      setTrends(await fetchTrends(profile))
      setTrend(null)
    } catch (error) {
      setTrendsError(errorMessage(error))
    } finally {
      setTrendsLoading(false)
    }
  }

  const handleSelectTrend = (selected) => {
    setTrend(selected)
    if (selected?.suggestedTopic && !topic.trim()) setTopic(selected.suggestedTopic)
  }

  const handleGenerate = async () => {
    const run = ++generationRun.current
    setGenerating(true)
    setGenerateError('')
    try {
      const result = await generatePost({ profile, topic: topic.trim(), platformId: activePlatform, trend })
      if (run !== generationRun.current) return
      setDraft({ ...result, platformId: activePlatform, topic: topic.trim() })
    } catch (error) {
      if (run === generationRun.current) setGenerateError(errorMessage(error))
    } finally {
      if (run === generationRun.current) setGenerating(false)
    }
  }

  const handleCopy = async () => {
    const ok = await copyText(postToText(draft))
    notify(ok ? 'Copied to clipboard' : 'Could not copy. Select the text and copy it manually.', ok ? 'success' : 'error')
    return ok
  }

  const handleConfirmSchedule = ({ mode, scheduledFor }) => {
    const base = {
      platformId: draft.platformId,
      topic: draft.topic,
      caption: draft.caption,
      hashtags: draft.hashtags,
      imagePrompt: draft.imagePrompt,
    }
    if (mode === 'now') {
      addPost({ ...base, status: 'published', publishedAt: new Date().toISOString() })
      notify('Post published (demo). See it in your history.')
    } else {
      addPost({ ...base, status: 'scheduled', scheduledFor })
      notify('Post scheduled. See it in your history.')
    }
    setScheduling(false)
    setDraft(null)
    setTopic('')
    setTrend(null)
    onViewHistory()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="space-y-6">
        <PostGenerator
          profile={profile}
          topic={topic}
          onTopicChange={setTopic}
          platformId={activePlatform}
          onPlatformChange={setPlatformId}
          trend={trend}
          onClearTrend={() => setTrend(null)}
          onGenerate={handleGenerate}
          loading={generating}
          error={generateError}
        />
        <TrendsPanel
          trends={trends}
          loading={trendsLoading}
          error={trendsError}
          selectedId={trend?.id}
          onFetch={handleFetchTrends}
          onSelect={handleSelectTrend}
        />
      </div>

      <div>
        {draft ? (
          <DraftReview
            draft={draft}
            brandName={profile.businessType}
            onChange={(patch) => setDraft((current) => ({ ...current, ...patch }))}
            onRegenerate={handleGenerate}
            onCopy={handleCopy}
            onSchedule={() => setScheduling(true)}
            loading={generating}
          />
        ) : (
          <Card className="flex min-h-80 flex-col items-center justify-center gap-3 border-dashed p-8 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <Sparkles className="size-6" />
            </span>
            <h2 className="text-base font-semibold text-slate-900">Your post will appear here</h2>
            <p className="max-w-xs text-sm text-slate-500">
              Describe a topic, pick a platform and hit Generate. Optionally fetch trending ideas first for
              inspiration.
            </p>
          </Card>
        )}
      </div>

      {scheduling && draft && <ScheduleModal onConfirm={handleConfirmSchedule} onClose={() => setScheduling(false)} />}
    </div>
  )
}
