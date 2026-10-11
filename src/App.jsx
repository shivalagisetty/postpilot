import { useState } from 'react'
import Dashboard from './components/Dashboard'
import HistoryTab from './components/HistoryTab'
import Navbar from './components/Navbar'
import OnboardingModal from './components/OnboardingModal'
import { ToastViewport } from './components/ui'
import { useApp } from './context/appContextValue'

export default function App() {
  const { profile, saveProfile, posts, toasts, dismissToast, notify } = useApp()
  const [view, setView] = useState('dashboard')
  const [editingProfile, setEditingProfile] = useState(false)

  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length

  const handleSaveProfile = (next) => {
    const isUpdate = Boolean(profile)
    saveProfile(next)
    setEditingProfile(false)
    notify(isUpdate ? 'Brand profile updated' : "You're all set. Let's create your first post!")
  }

  return (
    <div className="min-h-screen">
      <Navbar
        view={view}
        onViewChange={setView}
        onEditProfile={() => setEditingProfile(true)}
        scheduledCount={scheduledCount}
        profile={profile}
      />

      <main className="mx-auto max-w-6xl px-4 py-8">
        {profile && view === 'dashboard' && <Dashboard onViewHistory={() => setView('history')} />}
        {profile && view === 'history' && <HistoryTab onCreate={() => setView('dashboard')} />}
      </main>

      {(!profile || editingProfile) && (
        <OnboardingModal
          initial={profile}
          onSave={handleSaveProfile}
          onClose={profile ? () => setEditingProfile(false) : undefined}
        />
      )}

      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
