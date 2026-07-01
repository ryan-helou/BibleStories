import { describe, it, expect } from 'vitest'
import {
  categorizeAge,
  minutesToWordTarget,
  CustomStoryRequestSchema,
  WORDS_PER_MINUTE,
} from '@/lib/customStory'
import { buildUserPrompt } from '@/lib/storyPrompt'

describe('categorizeAge', () => {
  it('maps young ages to 3-5', () => {
    expect(categorizeAge(1)).toBe('3-5')
    expect(categorizeAge(4)).toBe('3-5')
    expect(categorizeAge(5)).toBe('3-5')
  })
  it('maps middle ages to 6-8', () => {
    expect(categorizeAge(6)).toBe('6-8')
    expect(categorizeAge(8)).toBe('6-8')
  })
  it('maps older ages to 9-12', () => {
    expect(categorizeAge(9)).toBe('9-12')
    expect(categorizeAge(12)).toBe('9-12')
    expect(categorizeAge(15)).toBe('9-12')
  })
})

describe('minutesToWordTarget', () => {
  it('scales linearly with the words-per-minute rate', () => {
    expect(minutesToWordTarget(1)).toBe(WORDS_PER_MINUTE)
    expect(minutesToWordTarget(5)).toBe(WORDS_PER_MINUTE * 5)
  })
})

describe('CustomStoryRequestSchema', () => {
  it('accepts a valid request', () => {
    const r = CustomStoryRequestSchema.safeParse({ age: 6, description: 'Story of Daniel', minutes: 3 })
    expect(r.success).toBe(true)
  })
  it('rejects out-of-range age and empty description', () => {
    expect(CustomStoryRequestSchema.safeParse({ age: 0, description: 'x', minutes: 3 }).success).toBe(false)
    expect(CustomStoryRequestSchema.safeParse({ age: 6, description: '', minutes: 3 }).success).toBe(false)
    expect(CustomStoryRequestSchema.safeParse({ age: 6, description: 'ok', minutes: 99 }).success).toBe(false)
  })
})

describe('buildUserPrompt', () => {
  it('includes the age, band guidance, description, and length target', () => {
    const prompt = buildUserPrompt({ age: 4, description: 'The story of Jonah', minutes: 2 })
    expect(prompt).toContain('4 years old')
    expect(prompt).toContain('Ages 3–5')
    expect(prompt).toContain('The story of Jonah')
    expect(prompt).toContain('2 minute')
    expect(prompt).toContain(String(minutesToWordTarget(2)))
  })
})
