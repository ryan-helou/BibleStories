import { describe, it, expect, beforeEach } from 'vitest'
import {
  addSavedStory,
  loadSavedStories,
  getSavedStory,
  updateSavedStory,
  toggleSavedFavorite,
  deleteSavedStory,
  savedStoryTitle,
} from '@/lib/savedStories'

beforeEach(() => localStorage.clear())

const base = {
  description: 'The story of Daniel. Focus on his faith.',
  age: 7,
  band: '6-8' as const,
  minutes: 3,
  story: 'Daniel prayed.',
  takeaways: ['Be brave.'],
  verse: null,
}

describe('savedStories', () => {
  it('returns empty when nothing is stored', () => {
    expect(loadSavedStories()).toEqual([])
  })

  it('adds a story with an id, and lists newest first', () => {
    const a = addSavedStory(base)
    const b = addSavedStory({ ...base, description: 'Jonah' })
    expect(a.id).toBeTruthy()
    expect(a.favorite).toBe(false)
    const all = loadSavedStories()
    expect(all).toHaveLength(2)
    expect(all[0].id).toBe(b.id) // newest first
  })

  it('gets a story by id', () => {
    const a = addSavedStory(base)
    expect(getSavedStory(a.id)?.story).toBe('Daniel prayed.')
    expect(getSavedStory('nope')).toBeUndefined()
  })

  it('attaches a verse via update without changing the id', () => {
    const a = addSavedStory(base)
    updateSavedStory(a.id, { verse: { text: 'The Lord is my shepherd.', reference: 'Psalm 23:1' } })
    expect(getSavedStory(a.id)?.verse?.reference).toBe('Psalm 23:1')
    expect(getSavedStory(a.id)?.id).toBe(a.id)
  })

  it('toggles favorite on and off', () => {
    const a = addSavedStory(base)
    toggleSavedFavorite(a.id)
    expect(getSavedStory(a.id)?.favorite).toBe(true)
    toggleSavedFavorite(a.id)
    expect(getSavedStory(a.id)?.favorite).toBe(false)
  })

  it('deletes a story', () => {
    const a = addSavedStory(base)
    deleteSavedStory(a.id)
    expect(getSavedStory(a.id)).toBeUndefined()
  })

  it('derives a short title from the description', () => {
    const a = addSavedStory(base)
    expect(savedStoryTitle(a)).toBe('The story of Daniel')
  })

  it('recovers from corrupt storage', () => {
    localStorage.setItem('biblestories.saved', '{not json')
    expect(loadSavedStories()).toEqual([])
  })
})
