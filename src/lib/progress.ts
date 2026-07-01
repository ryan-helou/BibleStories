export interface Progress {
  read: number[]
  favorites: number[]
  lastRead: number | null
}

const KEY = 'biblestories.progress'

export function emptyProgress(): Progress {
  return { read: [], favorites: [], lastRead: null }
}

function isProgress(v: unknown): v is Progress {
  if (typeof v !== 'object' || v === null) return false
  const p = v as Record<string, unknown>
  return (
    Array.isArray(p.read) &&
    Array.isArray(p.favorites) &&
    (p.lastRead === null || typeof p.lastRead === 'number')
  )
}

export function loadProgress(): Progress {
  if (typeof localStorage === 'undefined') return emptyProgress()
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyProgress()
    const parsed = JSON.parse(raw)
    return isProgress(parsed) ? parsed : emptyProgress()
  } catch {
    return emptyProgress()
  }
}

function save(p: Progress): Progress {
  if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, JSON.stringify(p))
  return p
}

export function markRead(order: number): Progress {
  const p = loadProgress()
  if (!p.read.includes(order)) p.read.push(order)
  return save(p)
}

export function toggleFavorite(order: number): Progress {
  const p = loadProgress()
  p.favorites = p.favorites.includes(order)
    ? p.favorites.filter((o) => o !== order)
    : [...p.favorites, order]
  return save(p)
}

export function setLastRead(order: number): Progress {
  const p = loadProgress()
  p.lastRead = order
  return save(p)
}
