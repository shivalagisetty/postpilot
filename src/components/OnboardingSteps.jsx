import { PLATFORMS, TONES } from '../lib/platforms'
import { cn } from '../lib/utils'
import { Input, Label, Pill, PlatformBadge } from './ui'

const BUSINESS_EXAMPLES = ['Coffee Shop', 'Fitness Coach', 'SaaS', 'Boutique Bakery']
const AUDIENCE_EXAMPLES = ['Local professionals', 'Gen-Z fitness enthusiasts', 'Busy parents']

function Examples({ items, onPick }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onPick(item)}
          className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200"
        >
          {item}
        </button>
      ))}
    </div>
  )
}

export function BusinessStep({ form, update }) {
  return (
    <div>
      <Label htmlFor="businessType">What type of business do you run?</Label>
      <Input
        id="businessType"
        autoFocus
        value={form.businessType}
        onChange={(e) => update({ businessType: e.target.value })}
        placeholder="e.g. Coffee Shop, Fitness Coach, SaaS"
        maxLength={80}
      />
      <Examples items={BUSINESS_EXAMPLES} onPick={(businessType) => update({ businessType })} />
    </div>
  )
}

export function AudienceStep({ form, update }) {
  return (
    <div>
      <Label htmlFor="audience">Who is your target audience?</Label>
      <Input
        id="audience"
        autoFocus
        value={form.audience}
        onChange={(e) => update({ audience: e.target.value })}
        placeholder="e.g. Local professionals, Gen-Z fitness enthusiasts"
        maxLength={120}
      />
      <Examples items={AUDIENCE_EXAMPLES} onPick={(audience) => update({ audience })} />
    </div>
  )
}

export function PlatformsStep({ form, update }) {
  const toggle = (id) =>
    update({
      platforms: form.platforms.includes(id) ? form.platforms.filter((p) => p !== id) : [...form.platforms, id],
    })

  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium text-slate-700">Which platforms do you post on?</legend>
      <p className="mb-3 text-xs text-slate-500">Select one or more.</p>
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((platform) => (
          <Pill key={platform.id} active={form.platforms.includes(platform.id)} onClick={() => toggle(platform.id)}>
            <PlatformBadge platformId={platform.id} size="sm" />
            {platform.name}
          </Pill>
        ))}
      </div>
    </fieldset>
  )
}

export function ToneStep({ form, update }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium text-slate-700">What is your brand tone?</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {TONES.map((tone) => (
          <button
            key={tone.id}
            type="button"
            aria-pressed={form.tone === tone.id}
            onClick={() => update({ tone: tone.id })}
            className={cn(
              'rounded-lg border p-3 text-left transition-colors',
              form.tone === tone.id
                ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                : 'border-slate-200 hover:bg-slate-50',
            )}
          >
            <span className="block text-sm font-medium text-slate-900">{tone.label}</span>
            <span className="block text-xs text-slate-500">{tone.description}</span>
          </button>
        ))}
      </div>
    </fieldset>
  )
}
