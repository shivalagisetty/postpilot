import { useCallback, useEffect, useMemo, useState } from 'react'
import { PLATFORMS, TONES } from '../lib/platforms'
import { makeId } from '../lib/utils'
import { AppContext } from './appContextValue'

const PROFILE_KEY = 'postpilot:profile'
const POSTS_KEY = 'postpilot:posts'

function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage may be full or blocked (private mode); the app still works in memory
  }
}

/** Accepts a stored profile only if it still has the expected shape. */
function sanitizeProfile(value) {
  if (!value || typeof value !== 'object') return null
  const platformIds = PLATFORMS.map((p) => p.id)
  const platforms = Array.isArray(value.platforms) ? value.platforms.filter((id) => platformIds.includes(id)) : []
  const tone = TONES.some((t) => t.id === value.tone) ? value.tone : null
  if (!value.businessType || !value.audience || !platforms.length || !tone) return null
  return {
    businessType: String(value.businessType),
    audience: String(value.audience),
    platforms,
    tone,
  }
}

function loadPosts() {
  const stored = readStorage(POSTS_KEY, [])
  return Array.isArray(stored) ? stored : []
}

const TOAST_MS = 3200

export function AppProvider({ children }) {
  const [profile, setProfile] = useState(() => sanitizeProfile(readStorage(PROFILE_KEY, null)))
  const [posts, setPosts] = useState(loadPosts)
  const [toasts, setToasts] = useState([])

  useEffect(() => writeStorage(PROFILE_KEY, profile), [profile])
  useEffect(() => writeStorage(POSTS_KEY, posts), [posts])

  // Mock scheduler: once a scheduled time has passed, mark the post as published.
  useEffect(() => {
    const publishDue = () => {
      const now = Date.now()
      setPosts((current) => {
        if (!current.some((p) => p.status === 'scheduled' && new Date(p.scheduledFor).getTime() <= now)) {
          return current
        }
        return current.map((p) =>
          p.status === 'scheduled' && new Date(p.scheduledFor).getTime() <= now
            ? { ...p, status: 'published', publishedAt: p.scheduledFor }
            : p,
        )
      })
    }
    publishDue()
    const timer = setInterval(publishDue, 15000)
    return () => clearInterval(timer)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }, [])

  const notify = useCallback(
    (message, type = 'success') => {
      const id = makeId()
      setToasts((current) => [...current, { id, message, type }])
      setTimeout(() => dismissToast(id), TOAST_MS)
    },
    [dismissToast],
  )

  const saveProfile = useCallback((next) => setProfile(sanitizeProfile(next)), [])

  const addPost = useCallback((post) => {
    const record = { ...post, id: makeId(), createdAt: new Date().toISOString() }
    setPosts((current) => [record, ...current])
    return record
  }, [])

  const publishPost = useCallback((id) => {
    setPosts((current) =>
      current.map((p) => (p.id === id ? { ...p, status: 'published', publishedAt: new Date().toISOString() } : p)),
    )
  }, [])

  const removePost = useCallback((id) => {
    setPosts((current) => current.filter((p) => p.id !== id))
  }, [])

  const clearPosts = useCallback(() => setPosts([]), [])

  const value = useMemo(
    () => ({
      profile,
      saveProfile,
      posts,
      addPost,
      publishPost,
      removePost,
      clearPosts,
      toasts,
      notify,
      dismissToast,
    }),
    [profile, saveProfile, posts, addPost, publishPost, removePost, clearPosts, toasts, notify, dismissToast],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
