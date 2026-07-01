import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAgeBand } from '@/lib/useAgeBand'
import { DEFAULT_AGE_BAND } from '@/content/ageBands'

beforeEach(() => localStorage.clear())

describe('useAgeBand', () => {
  it('defaults when nothing stored', () => {
    const { result } = renderHook(() => useAgeBand())
    expect(result.current.ageBand).toBe(DEFAULT_AGE_BAND)
  })

  it('persists a chosen band', () => {
    const { result } = renderHook(() => useAgeBand())
    act(() => result.current.setAgeBand('9-12'))
    expect(result.current.ageBand).toBe('9-12')
    expect(localStorage.getItem('biblestories.ageBand')).toBe('9-12')
  })
})
