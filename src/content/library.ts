import { StorySchema, type Story } from './schema'
import { story as creation } from './stories/001-creation'
import { story as noah } from './stories/002-noah-and-the-flood'
import { story as birthOfJesus } from './stories/003-the-birth-of-jesus'

export function sortByOrder(stories: Story[]): Story[] {
  return [...stories].sort((a, b) => a.order - b.order)
}

export function validateLibrary(stories: Story[]): Story[] {
  stories.forEach((s) => StorySchema.parse(s))
  const sorted = sortByOrder(stories)
  const seen = new Set<number>()
  sorted.forEach((s, i) => {
    if (seen.has(s.order)) throw new Error(`duplicate order: ${s.order}`)
    seen.add(s.order)
    if (s.order !== i + 1) {
      throw new Error(`order sequence gap: expected ${i + 1}, got ${s.order}`)
    }
  })
  return sorted
}

const RAW: Story[] = [creation, noah, birthOfJesus]

export const STORIES: Story[] = validateLibrary(RAW)

export function getAllStories(): Story[] {
  return STORIES
}

export function getStoryByOrder(order: number): Story | undefined {
  return STORIES.find((s) => s.order === order)
}

export function getAdjacent(order: number): { prev?: Story; next?: Story } {
  const idx = STORIES.findIndex((s) => s.order === order)
  return {
    prev: idx > 0 ? STORIES[idx - 1] : undefined,
    next: idx >= 0 && idx < STORIES.length - 1 ? STORIES[idx + 1] : undefined,
  }
}
