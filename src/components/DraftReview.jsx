import { useState } from 'react'
import { CalendarClock, Check, Copy, Image as ImageIcon, RefreshCw, Shuffle } from 'lucide-react'
import { getPlatform } from '../lib/platforms'
import { Button, Card, Textarea } from './ui'
import PostPreviewCard from './PostPreviewCard'

/** Review area: platform preview, image idea swapper, and the Copy / Schedule actions. */
export default function DraftReview({ draft, brandName, onChange, onRegenerate, onCopy, onSchedule, loading }) {
  const platform = getPlatform(draft.platformId)
  const [editingPrompt, setEditingPrompt] = useState(false)
  const [copied, setCopied] = useState(false)

  const swapIdea = () => {
    const ideas = draft.imageIdeas
    if (ideas.length < 2) return
    const current = ideas.indexOf(draft.imagePrompt)
    onChange({ imagePrompt: ideas[(current + 1) % ideas.length] })
  }

  const handleCopy = async () => {
    const ok = await onCopy()
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">{platform.name} preview</h2>
        <p className="text-xs text-slate-400">Click the caption or hashtags to edit</p>
      </div>

      <PostPreviewCard post={draft} brandName={brandName} onChange={onChange} />

      <Card className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <ImageIcon className="size-4 text-indigo-600" /> Visual prompt / image idea
          </h3>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={swapIdea} disabled={draft.imageIdeas.length < 2}>
              <Shuffle className="size-3.5" /> Swap idea
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setEditingPrompt((v) => !v)}>
              {editingPrompt ? 'Done' : 'Edit'}
            </Button>
          </div>
        </div>
        {editingPrompt ? (
          <Textarea
            className="mt-2"
            rows={4}
            aria-label="Image prompt"
            value={draft.imagePrompt}
            onChange={(e) => onChange({ imagePrompt: e.target.value })}
          />
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{draft.imagePrompt}</p>
        )}
        <p className="mt-2 text-xs text-slate-400">
          Use this prompt in an image generator, or upload your own photo when you post.
        </p>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={handleCopy}>
          {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
          {copied ? 'Copied' : 'Copy to clipboard'}
        </Button>
        <Button variant="secondary" onClick={onRegenerate} disabled={loading}>
          <RefreshCw className={loading ? 'size-4 animate-spin' : 'size-4'} />
          Regenerate
        </Button>
        <Button className="sm:ml-auto" onClick={onSchedule}>
          <CalendarClock className="size-4" /> Schedule / Post
        </Button>
      </div>
    </div>
  )
}
