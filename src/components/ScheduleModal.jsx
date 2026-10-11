import { useState } from 'react'
import { CalendarClock, Send } from 'lucide-react'
import { toLocalInput } from '../lib/utils'
import { Button, Input, Label, Modal } from './ui'

/** Lets the user publish now or pick a future date/time (mock action). */
export default function ScheduleModal({ onConfirm, onClose }) {
  const [mode, setMode] = useState('now')
  // "Now" is captured once when the modal opens (keeps render pure).
  const [minValue] = useState(() => toLocalInput(new Date()))
  const [when, setWhen] = useState(() => {
    const date = new Date(Date.now() + 60 * 60 * 1000)
    date.setMinutes(0, 0, 0)
    return toLocalInput(date)
  })

  const whenDate = new Date(when)
  const whenValid = mode === 'now' || (Boolean(when) && !Number.isNaN(whenDate.getTime()) && when > minValue)

  const submit = (event) => {
    event.preventDefault()
    if (!whenValid) return
    if (mode === 'later' && whenDate.getTime() <= Date.now()) return
    onConfirm(mode === 'now' ? { mode: 'now' } : { mode: 'later', scheduledFor: whenDate.toISOString() })
  }

  const options = [
    { id: 'now', label: 'Post now', description: 'Publish immediately', Icon: Send },
    { id: 'later', label: 'Schedule', description: 'Pick a date and time', Icon: CalendarClock },
  ]

  return (
    <Modal title="Schedule or post" description="This is a demo action. Nothing is sent to a real account." onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {options.map(({ id, label, description, Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={mode === id}
              onClick={() => setMode(id)}
              className={
                'rounded-lg border p-3 text-left transition-colors ' +
                (mode === id
                  ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                  : 'border-slate-200 hover:bg-slate-50')
              }
            >
              <Icon className="mb-1 size-4 text-indigo-600" />
              <span className="block text-sm font-medium text-slate-900">{label}</span>
              <span className="block text-xs text-slate-500">{description}</span>
            </button>
          ))}
        </div>

        {mode === 'later' && (
          <div>
            <Label htmlFor="when">Date and time</Label>
            <Input id="when" type="datetime-local" min={minValue} value={when} onChange={(e) => setWhen(e.target.value)} />
            {!whenValid && <p className="mt-1.5 text-xs text-rose-600">Choose a time in the future.</p>}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!whenValid}>
            {mode === 'now' ? 'Post now' : 'Schedule post'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
