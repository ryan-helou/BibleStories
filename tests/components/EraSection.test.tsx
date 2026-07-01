import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EraSection } from '@/components/EraSection'
import type { Story } from '@/content/schema'

const story: Story = {
  order: 1, era: 'Creation', title: 'God Makes the World',
  sourcePassage: 'Genesis 1–2', teaser: 'God speaks the world into being.',
  bands: {
    '3-5': { body: 'b', themes: ['t'], takeaways: ['k'], crossReferences: [], pronunciationHints: [] },
    '6-8': { body: 'b', themes: ['t'], takeaways: ['k'], crossReferences: [], pronunciationHints: [] },
    '9-12': { body: 'b', themes: ['t'], takeaways: ['k'], crossReferences: [], pronunciationHints: [] },
  },
}

describe('EraSection', () => {
  it('shows the era heading and its stories', () => {
    render(<EraSection era="Creation" stories={[story]} readSet={new Set()} />)
    expect(screen.getByRole('heading', { name: 'Creation' })).toBeInTheDocument()
    expect(screen.getByText('God Makes the World')).toBeInTheDocument()
  })
})
