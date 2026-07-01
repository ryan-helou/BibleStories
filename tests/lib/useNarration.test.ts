import { describe, it, expect } from 'vitest'
import { splitIntoChunks } from '@/lib/useNarration'

describe('splitIntoChunks', () => {
  it('returns nothing for empty/whitespace input', () => {
    expect(splitIntoChunks('')).toEqual([])
    expect(splitIntoChunks('   \n  ')).toEqual([])
  })

  it('keeps a short passage as a single chunk', () => {
    expect(splitIntoChunks('God is love.')).toEqual(['God is love.'])
  })

  it('groups sentences without splitting mid-sentence, under the length cap', () => {
    const text = 'A'.repeat(120) + '. ' + 'B'.repeat(120) + '.'
    const chunks = splitIntoChunks(text)
    expect(chunks.length).toBe(2)
    for (const c of chunks) expect(c.length).toBeLessThanOrEqual(181)
  })

  it('collapses paragraph whitespace and preserves all sentences in order', () => {
    const text = 'One day.\n\n  Two days.\tThree days.'
    expect(splitIntoChunks(text).join(' ')).toBe('One day. Two days. Three days.')
  })
})
