import { describe, it, expect, beforeEach } from 'vitest'
import {
  loadProgress,
  markRead,
  toggleFavorite,
  setLastRead,
  emptyProgress,
} from '@/lib/progress'

beforeEach(() => localStorage.clear())

describe('progress', () => {
  it('returns empty progress when nothing is stored', () => {
    expect(loadProgress()).toEqual(emptyProgress())
  })

  it('marks a story read (idempotent)', () => {
    markRead(2)
    markRead(2)
    expect(loadProgress().read).toEqual([2])
  })

  it('toggles a favorite on and off', () => {
    toggleFavorite(5)
    expect(loadProgress().favorites).toEqual([5])
    toggleFavorite(5)
    expect(loadProgress().favorites).toEqual([])
  })

  it('records the last read story', () => {
    setLastRead(3)
    expect(loadProgress().lastRead).toBe(3)
  })

  it('recovers from corrupt storage', () => {
    localStorage.setItem('biblestories.progress', '{not json')
    expect(loadProgress()).toEqual(emptyProgress())
  })
})
