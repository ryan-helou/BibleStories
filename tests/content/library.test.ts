import { describe, it, expect } from 'vitest'
import { validateLibrary, sortByOrder } from '@/content/library'
import type { Story } from '@/content/schema'

function make(order: number): Story {
  return {
    order,
    era: 'Creation',
    title: `Story ${order}`,
    sourcePassage: 'Genesis 1',
    teaser: 'teaser',
    bands: {
      '3-5': { body: 'b', themes: ['t'], takeaways: ['k'], crossReferences: [], pronunciationHints: [] },
      '6-8': { body: 'b', themes: ['t'], takeaways: ['k'], crossReferences: [], pronunciationHints: [] },
      '9-12': { body: 'b', themes: ['t'], takeaways: ['k'], crossReferences: [], pronunciationHints: [] },
    },
  }
}

describe('sortByOrder', () => {
  it('sorts ascending by order', () => {
    expect(sortByOrder([make(3), make(1), make(2)]).map((s) => s.order)).toEqual([1, 2, 3])
  })
})

describe('validateLibrary', () => {
  it('passes for gapless unique orders starting at 1', () => {
    expect(() => validateLibrary([make(1), make(2), make(3)])).not.toThrow()
  })
  it('throws on a duplicate order', () => {
    expect(() => validateLibrary([make(1), make(1)])).toThrow(/duplicate/i)
  })
  it('throws on a gap in ordering', () => {
    expect(() => validateLibrary([make(1), make(3)])).toThrow(/gap|sequence/i)
  })
  it('throws when a story violates the schema', () => {
    const bad = { ...make(1), title: '' }
    expect(() => validateLibrary([bad as Story])).toThrow()
  })
})
