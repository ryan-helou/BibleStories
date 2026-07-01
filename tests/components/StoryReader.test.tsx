import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StoryReader } from '@/app/story/[order]/StoryReader'
import { loadProgress } from '@/lib/progress'
import type { Story } from '@/content/schema'

const story: Story = {
  order: 1, era: 'Creation', title: 'God Makes the World',
  sourcePassage: 'Genesis 1–2', teaser: 'God speaks the world into being.',
  bands: {
    '3-5': { body: 'Little body.', themes: ['t3'], takeaways: ['k3'], crossReferences: [], pronunciationHints: [] },
    '6-8': { body: 'Middle body.', themes: ['t6'], takeaways: ['k6'], crossReferences: [], pronunciationHints: [] },
    '9-12': { body: 'Older body.', themes: ['t9'], takeaways: ['k9'], crossReferences: [], pronunciationHints: [] },
  },
}

beforeEach(() => localStorage.clear())

describe('StoryReader', () => {
  it('renders the body for the default age band and the title', () => {
    render(<StoryReader story={story} prevOrder={null} nextOrder={2} />)
    expect(screen.getByRole('heading', { name: 'God Makes the World' })).toBeInTheDocument()
    expect(screen.getByText('Middle body.')).toBeInTheDocument() // default band 6-8
  })

  it('marks the story read and records last-read on mount', () => {
    render(<StoryReader story={story} prevOrder={null} nextOrder={2} />)
    const p = loadProgress()
    expect(p.read).toContain(1)
    expect(p.lastRead).toBe(1)
  })
})
