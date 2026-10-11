import { useState } from 'react'
import { CalendarClock, CheckCircle2, Copy, History, Send, Trash2 } from 'lucide-react'
import { useApp } from '../context/appContextValue'
import { getPlatform } from '../lib/platforms'
import { cn, copyText, formatDateTime, postToText } from '../lib/utils'
import PostPreviewCard from './PostPreviewCard'
import { Button, Card, PlatformBadge } from './ui'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'published', label: 'Published' },
]

function StatusBadge({ post }) {
  const scheduled = post.status === 'scheduled'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        scheduled ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700',
      )}
    >
      {scheduled ? <CalendarClock className="size-3" /> : <CheckCircle2 className="size-3" />}
      {scheduled ? `Scheduled · ${formatDateTime(post.scheduledFor)}` : `Published · ${formatDateTime(post.publishedAt)}`}
    </span>
  )
}

export default function HistoryTab({ onCreate }) {
  const { profile, posts, publishPost, removePost, clearPosts, notify } = useApp()
  const [filter, setFilter] = useState('all')
  const [confirmClear, setConfirmClear] = useState(false)

  const counts = {
    all: posts.length,
    scheduled: posts.filter((p) => p.status === 'scheduled').length,
    published: posts.filter((p) => p.status === 'published').length,
  }
  const visible = filter === 'all' ? posts : posts.filter((p) => p.status === filter)

  const handleCopy = async (post) => {
    const ok = await copyText(postToText(post))
    notify(ok ? 'Copied to clipboard' : 'Could not copy to clipboard', ok ? 'success' : 'error')
  }

  const handlePublish = (post) => {
    publishPost(post.id)
    notify('Post published (demo)')
  }

  const handleDelete = (post) => {
    removePost(post.id)
    notify('Post deleted')
  }

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 4000)
      return
    }
    clearPosts()
    setConfirmClear(false)
    notify('History cleared')
  }

  if (!posts.length) {
    return (
      <Card className="flex min-h-80 flex-col items-center justify-center gap-3 border-dashed p-8 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <History className="size-6" />
        </span>
        <h2 className="text-base font-semibold text-slate-900">Nothing here yet</h2>
        <p className="max-w-xs text-sm text-slate-500">Posts you schedule or publish will show up here.</p>
        <Button onClick={onCreate}>Create your first post</Button>
      </Card>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1" role="tablist" aria-label="Filter posts">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={filter === id}
              onClick={() => setFilter(id)}
              className={cn(
                'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                filter === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700',
              )}
            >
              {label} <span className="text-slate-400">{counts[id]}</span>
            </button>
          ))}
        </div>
        <Button variant="danger" size="sm" onClick={handleClear}>
          <Trash2 className="size-3.5" /> {confirmClear ? 'Click again to confirm' : 'Clear history'}
        </Button>
      </div>

      {visible.length === 0 && <p className="py-10 text-center text-sm text-slate-500">No {filter} posts.</p>}

      <ul className="grid gap-6 md:grid-cols-2">
        {visible.map((post) => (
          <li key={post.id} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <PlatformBadge platformId={post.platformId} />
              <span className="text-sm font-medium text-slate-900">{getPlatform(post.platformId).name}</span>
              <StatusBadge post={post} />
            </div>
            <PostPreviewCard post={post} brandName={profile?.businessType} readOnly />
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => handleCopy(post)}>
                <Copy className="size-3.5" /> Copy
              </Button>
              {post.status === 'scheduled' && (
                <Button size="sm" variant="secondary" onClick={() => handlePublish(post)}>
                  <Send className="size-3.5" /> Post now
                </Button>
              )}
              <Button size="sm" variant="danger" className="ml-auto" onClick={() => handleDelete(post)}>
                <Trash2 className="size-3.5" /> Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
