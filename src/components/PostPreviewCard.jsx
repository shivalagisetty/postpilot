import { getPlatform } from '../lib/platforms'
import { cn, postLength } from '../lib/utils'
import PlatformLayout from './PostLayouts'
import { EditableCaption, HashtagEditor, PostImage } from './PostParts'

const handleOf = (name) => String(name).toLowerCase().replace(/[^a-z0-9]+/g, '') || 'yourbrand'

/**
 * Realistic preview of a post for its platform.
 * Pass `onChange(partialPost)` to make caption + hashtags editable inline,
 * or `readOnly` for history views.
 */
export default function PostPreviewCard({ post, brandName, onChange, readOnly = false }) {
  const platform = getPlatform(post.platformId)
  const name = brandName || 'Your Brand'
  const editable = !readOnly && typeof onChange === 'function'

  const length = postLength(post)
  const overLimit = length > platform.limit

  return (
    <div>
      <article
        aria-label={`${platform.name} post preview`}
        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        <PlatformLayout
          platformId={platform.id}
          name={name}
          handle={handleOf(name)}
          caption={
            <EditableCaption
              value={post.caption}
              readOnly={!editable}
              onChange={(caption) => onChange({ caption })}
              className="text-sm leading-relaxed text-slate-800"
            />
          }
          hashtags={
            <HashtagEditor
              tags={post.hashtags}
              readOnly={!editable}
              onChange={(hashtags) => onChange({ hashtags })}
            />
          }
          image={<PostImage prompt={post.imagePrompt} aspect={platform.aspect} />}
        />
      </article>
      {platform.limit <= 3000 && (
        <p className={cn('mt-1.5 text-right text-xs', overLimit ? 'font-medium text-rose-600' : 'text-slate-400')}>
          {length} / {platform.limit} characters{overLimit ? ' (over the limit)' : ''}
        </p>
      )}
    </div>
  )
}
