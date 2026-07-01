import { describe, it, expect } from 'vitest'
import { getAllStories } from '@/content/library'
import { StorySchema } from '@/content/schema'

describe('starter library content', () => {
  const stories = getAllStories()

  it('has three stories', () => {
    expect(stories).toHaveLength(3)
  })

  it('every story matches the schema', () => {
    stories.forEach((s) => expect(() => StorySchema.parse(s)).not.toThrow())
  })

  it('orders are gapless starting at 1', () => {
    expect(stories.map((s) => s.order)).toEqual([1, 2, 3])
  })
})
