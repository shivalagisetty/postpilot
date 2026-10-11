import { useEffect, useRef, useState } from 'react'
import { Image as ImageIcon, Pencil, Plus, X } from 'lucide-react'
import { cn, normalizeHashtag } from '../lib/utils'

/** Caption text. Click to edit inline; commits on blur. */
export function EditableCaption({ value, onChange, readOnly, className }) {
  const [editing, setEditing] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!editing || !el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
    el.focus()
    el.setSelectionRange(el.value.length, el.value.length)
  }, [editing, value])

  if (readOnly) {
    return <p className={cn('whitespace-pre-wrap break-words', className)}>{value}</p>
  }

  if (editing) {
    return (
      <textarea
        ref={ref}
        value={value}
        aria-label="Edit caption"
        onChange={(event) => onChange(event.target.value)}
        onBlur={() => setEditing(false)}
        className={cn(
          'block w-full resize-none rounded-md bg-indigo-50/50 p-1.5 -m-1.5 ring-2 ring-indigo-500 focus:outline-none',
          className,
        )}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      title="Click to edit"
      className={cn(
        'group relative block w-full cursor-text rounded-md text-left whitespace-pre-wrap break-words',
        'hover:bg-indigo-50/60 focus-visible:outline-2 focus-visible:outline-indigo-500',
        className,
      )}
    >
      {value || <span className="text-slate-400">Click to write a caption…</span>}
      <Pencil className="absolute top-0 right-0 size-3.5 text-indigo-500 opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  )
}

/** Hashtag chips with add / remove. */
export function HashtagEditor({ tags, onChange, readOnly, tagClass = 'text-sky-600' }) {
  const [draft, setDraft] = useState('')

  const add = () => {
    const parts = draft.split(/[\s,]+/).map(normalizeHashtag).filter(Boolean)
    setDraft('')
    if (!parts.length) return
    const existing = new Set(tags.map((t) => t.toLowerCase()))
    const fresh = parts.filter((tag, i) => !existing.has(tag.toLowerCase()) && parts.indexOf(tag) === i)
    if (fresh.length) onChange([...tags, ...fresh])
  }

  const onKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      add()
    } else if (event.key === 'Backspace' && !draft && tags.length) {
      onChange(tags.slice(0, -1))
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      {tags.map((tag) =>
        readOnly ? (
          <span key={tag} className={cn('text-sm', tagClass)}>
            {tag}
          </span>
        ) : (
          <span
            key={tag}
            className={cn('inline-flex items-center gap-0.5 rounded-full bg-slate-100 py-0.5 pr-1 pl-2 text-sm', tagClass)}
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              className="rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
            >
              <X className="size-3" />
            </button>
          </span>
        ),
      )}
      {!readOnly && (
        <span className="inline-flex items-center gap-1 text-sm text-slate-400">
          <Plus className="size-3.5" />
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onKeyDown}
            onBlur={add}
            aria-label="Add hashtag"
            placeholder="add hashtag"
            className="w-28 bg-transparent text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        </span>
      )}
    </div>
  )
}

/** Placeholder image card that shows the current image idea. */
export function PostImage({ prompt, aspect, className }) {
  return (
    <div
      className={cn(
        'relative flex w-full flex-col items-center justify-center gap-2 overflow-hidden px-6 text-center',
        'bg-gradient-to-br from-indigo-100 via-fuchsia-100 to-amber-100',
        aspect,
        className,
      )}
    >
      <ImageIcon className="size-8 text-indigo-400" />
      <p className="line-clamp-4 text-xs text-slate-600">{prompt || 'No image idea yet'}</p>
      <span className="absolute right-2 bottom-2 rounded bg-white/70 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
        AI image placeholder
      </span>
    </div>
  )
}

export function Avatar({ name, className }) {
  const letter = (String(name).trim()[0] ?? 'B').toUpperCase()
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 font-semibold text-white',
        className,
      )}
    >
      {letter}
    </span>
  )
}
