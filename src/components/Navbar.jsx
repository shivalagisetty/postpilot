import { History, LayoutDashboard, Send, Settings } from 'lucide-react'
import { cn } from '../lib/utils'

const TABS = [
  { id: 'dashboard', label: 'Create', Icon: LayoutDashboard },
  { id: 'history', label: 'Scheduled & Published', Icon: History },
]

export default function Navbar({ view, onViewChange, onEditProfile, scheduledCount, profile }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Send className="size-4" />
          </span>
          <span className="text-base font-bold tracking-tight text-slate-900">PostPilot</span>
        </div>

        <nav aria-label="Main" className="flex flex-1 items-center gap-1">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onViewChange(id)}
              aria-current={view === id ? 'page' : undefined}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                view === id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100',
              )}
            >
              <Icon className="size-4" />
              <span className={id === 'history' ? 'hidden sm:inline' : undefined}>{label}</span>
              {id === 'history' && scheduledCount > 0 && (
                <span className="rounded-full bg-indigo-600 px-1.5 text-[11px] leading-5 font-semibold text-white">
                  {scheduledCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {profile && (
          <button
            type="button"
            onClick={onEditProfile}
            className="inline-flex max-w-52 items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
            title="Edit brand profile"
          >
            <Settings className="size-4 shrink-0" />
            <span className="hidden truncate sm:inline">{profile.businessType}</span>
          </button>
        )}
      </div>
    </header>
  )
}
