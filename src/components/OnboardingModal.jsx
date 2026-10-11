import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Megaphone } from 'lucide-react'
import { PLATFORMS } from '../lib/platforms'
import { cn } from '../lib/utils'
import { AudienceStep, BusinessStep, PlatformsStep, ToneStep } from './OnboardingSteps'
import { Button, Modal } from './ui'

const STEPS = [
  { label: 'Business', Component: BusinessStep },
  { label: 'Audience', Component: AudienceStep },
  { label: 'Platforms', Component: PlatformsStep },
  { label: 'Tone', Component: ToneStep },
]

/**
 * Multi-step brand profile form. Used for first-run onboarding (no onClose)
 * and for editing the profile later (with onClose).
 */
export default function OnboardingModal({ initial, onSave, onClose }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    businessType: initial?.businessType ?? '',
    audience: initial?.audience ?? '',
    platforms: initial?.platforms ?? [],
    tone: initial?.tone ?? '',
  })

  const update = (patch) => setForm((current) => ({ ...current, ...patch }))

  const valid = [
    form.businessType.trim().length > 1,
    form.audience.trim().length > 1,
    form.platforms.length > 0,
    Boolean(form.tone),
  ]
  const isLast = step === STEPS.length - 1
  const { Component: StepBody } = STEPS[step]

  const onSubmit = (event) => {
    event.preventDefault()
    if (!valid[step]) return
    if (!isLast) {
      setStep(step + 1)
      return
    }
    onSave({
      businessType: form.businessType.trim(),
      audience: form.audience.trim(),
      platforms: PLATFORMS.map((p) => p.id).filter((id) => form.platforms.includes(id)),
      tone: form.tone,
    })
  }

  return (
    <Modal
      title={initial ? 'Edit brand profile' : 'Welcome to PostPilot'}
      description={initial ? 'Update your brand details.' : "Tell us about your brand and we'll tailor every post."}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <ol className="flex items-center gap-2" aria-label="Progress">
          {STEPS.map(({ label }, index) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                aria-current={index === step ? 'step' : undefined}
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                  index < step && 'bg-indigo-600 text-white',
                  index === step && 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-600',
                  index > step && 'bg-slate-100 text-slate-400',
                )}
              >
                {index < step ? <Check className="size-3.5" /> : index + 1}
              </span>
              <span
                className={cn('hidden text-xs sm:inline', index === step ? 'font-medium text-slate-900' : 'text-slate-400')}
              >
                {label}
              </span>
              {index < STEPS.length - 1 && <span className="h-px flex-1 bg-slate-200" />}
            </li>
          ))}
        </ol>

        <StepBody key={step} form={form} update={update} />

        <div className="flex items-center justify-between pt-2">
          {step > 0 ? (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>
              <ArrowLeft className="size-4" /> Back
            </Button>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <Megaphone className="size-3.5" /> Saved on this device
            </span>
          )}
          <Button type="submit" disabled={!valid[step]}>
            {isLast ? (initial ? 'Save changes' : 'Finish setup') : 'Continue'}
            {isLast ? <Check className="size-4" /> : <ArrowRight className="size-4" />}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
