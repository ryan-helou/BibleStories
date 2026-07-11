import type { AgeBand } from '@/content/schema'
import type { Verse } from '@/lib/customStory'

/**
 * A generated ("just for tonight") story, persisted so a parent can re-read it
 * on later nights — kids famously ask for the same story again. Library stories
 * live in code and track progress by numeric order; generated stories live here
 * in localStorage, keyed by a random id.
 */
export interface SavedStory {
  id: string
  createdAt: number
  description: string
  age: number
  band: AgeBand
  minutes: number
  story: string
  takeaways: string[]
  verse: Verse | null
  favorite: boolean
}

const KEY = 'biblestories.saved'

function isSavedStory(v: unknown): v is SavedStory {
  if (typeof v !== 'object' || v === null) return false
  const s = v as Record<string, unknown>
  return (
    typeof s.id === 'string' &&
    typeof s.createdAt === 'number' &&
    typeof s.description === 'string' &&
    typeof s.story === 'string' &&
    Array.isArray(s.takeaways)
  )
}

export function loadSavedStories(): SavedStory[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isSavedStory) : []
  } catch {
    return []
  }
}

function persist(stories: SavedStory[]): SavedStory[] {
  if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, JSON.stringify(stories))
  return stories
}

export function getSavedStory(id: string): SavedStory | undefined {
  return loadSavedStories().find((s) => s.id === id)
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `s_${Math.abs(Date.now())}_${loadSavedStories().length}`
}

/** Create a new saved story (newest first). Returns the stored record with its id. */
export function addSavedStory(
  input: Omit<SavedStory, 'id' | 'createdAt' | 'favorite'>,
): SavedStory {
  const entry: SavedStory = {
    ...input,
    id: newId(),
    createdAt: Date.now(),
    favorite: false,
  }
  persist([entry, ...loadSavedStories()])
  return entry
}

/** Merge changes into an existing saved story (e.g. attach the verse once it arrives). */
export function updateSavedStory(id: string, patch: Partial<SavedStory>): SavedStory[] {
  return persist(
    loadSavedStories().map((s) => (s.id === id ? { ...s, ...patch, id: s.id } : s)),
  )
}

export function toggleSavedFavorite(id: string): SavedStory[] {
  return persist(
    loadSavedStories().map((s) => (s.id === id ? { ...s, favorite: !s.favorite } : s)),
  )
}

export function deleteSavedStory(id: string): SavedStory[] {
  return persist(loadSavedStories().filter((s) => s.id !== id))
}

/** A short, human label for a saved story (its description, trimmed). */
export function savedStoryTitle(s: SavedStory): string {
  const first = s.description.split(/[.\n]/)[0].trim()
  const label = first || s.description.trim()
  return label.length > 60 ? `${label.slice(0, 57)}…` : label
}
