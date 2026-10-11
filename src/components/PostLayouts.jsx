import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Send,
  Share2,
  ThumbsUp,
} from 'lucide-react'
import { Avatar } from './PostParts'

/**
 * Platform-specific layouts. Each receives pre-built pieces:
 *   caption, hashtags, image (React nodes), plus name / handle strings.
 */

function InstagramLayout({ name, handle, caption, hashtags, image }) {
  return (
    <>
      <header className="flex items-center gap-2.5 px-3 py-2.5">
        <Avatar name={name} className="size-8 text-sm ring-2 ring-pink-400 ring-offset-2" />
        <div className="min-w-0 flex-1 text-sm font-semibold text-slate-900">{handle}</div>
        <MoreHorizontal className="size-5 text-slate-500" />
      </header>
      {image}
      <div className="flex items-center gap-4 px-3 pt-3 text-slate-800">
        <Heart className="size-6" />
        <MessageCircle className="size-6" />
        <Send className="size-6" />
        <Bookmark className="ml-auto size-6" />
      </div>
      <div className="space-y-2 px-3 pt-2 pb-4">
        <p className="text-sm font-semibold text-slate-900">1,248 likes</p>
        <div>
          <span className="mb-0.5 block text-sm font-semibold text-slate-900">{handle}</span>
          {caption}
        </div>
        {hashtags}
      </div>
    </>
  )
}

function ActionRow({ items }) {
  return (
    <footer className="flex items-center justify-around border-t border-slate-200 px-2 py-2 text-sm font-medium text-slate-600">
      {items.map(({ label, Icon }) => (
        <span key={label} className="inline-flex items-center gap-1.5">
          <Icon className="size-4" /> {label}
        </span>
      ))}
    </footer>
  )
}

function LinkedInLayout({ name, caption, hashtags, image }) {
  return (
    <>
      <header className="flex items-start gap-3 px-4 pt-4">
        <Avatar name={name} className="size-12 text-lg" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">{name}</p>
          <p className="text-xs text-slate-500">1,204 followers</p>
          <p className="text-xs text-slate-500">Just now Â· ðŸŒ</p>
        </div>
        <MoreHorizontal className="size-5 text-slate-500" />
      </header>
      <div className="space-y-2 px-4 py-3">
        {caption}
        {hashtags}
      </div>
      {image}
      <ActionRow
        items={[
          { label: 'Like', Icon: ThumbsUp },
          { label: 'Comment', Icon: MessageCircle },
          { label: 'Repost', Icon: Repeat2 },
          { label: 'Send', Icon: Send },
        ]}
      />
    </>
  )
}

function TwitterLayout({ name, handle, caption, hashtags, image }) {
  return (
    <div className="flex gap-3 p-4">
      <Avatar name={name} className="size-10 bg-neutral-900 text-base" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center gap-1.5 text-sm">
          <span className="font-bold text-slate-900">{name}</span>
          <span className="truncate text-slate-500">@{handle} Â· now</span>
        </div>
        {caption}
        {hashtags}
        <div className="overflow-hidden rounded-2xl border border-slate-200">{image}</div>
        <div className="flex items-center justify-between pt-1 pr-6 text-slate-500">
          <MessageCircle className="size-4" />
          <Repeat2 className="size-4" />
          <Heart className="size-4" />
          <Share2 className="size-4" />
        </div>
      </div>
    </div>
  )
}

function FacebookLayout({ name, caption, hashtags, image }) {
  return (
    <>
      <header className="flex items-center gap-2.5 px-4 pt-4">
        <Avatar name={name} className="size-10 bg-blue-600 text-base" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">{name}</p>
          <p className="text-xs text-slate-500">Just now Â· ðŸŒ</p>
        </div>
        <MoreHorizontal className="size-5 text-slate-500" />
      </header>
      <div className="space-y-2 px-4 py-3">
        {caption}
        {hashtags}
      </div>
      {image}
      <ActionRow
        items={[
          { label: 'Like', Icon: ThumbsUp },
          { label: 'Comment', Icon: MessageCircle },
          { label: 'Share', Icon: Share2 },
        ]}
      />
    </>
  )
}

const LAYOUTS = {
  instagram: InstagramLayout,
  linkedin: LinkedInLayout,
  twitter: TwitterLayout,
  facebook: FacebookLayout,
}


/** Renders the layout that matches the platform (falls back to Facebook). */
export default function PlatformLayout({ platformId, ...props }) {
  const Layout = LAYOUTS[platformId] ?? FacebookLayout
  return <Layout {...props} />
}
