import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReflectTogether } from '@/components/ReflectTogether'
import type { AgeBandContent } from '@/content/schema'

const content: AgeBandContent = {
  body: 'b',
  themes: ['God is Creator'],
  takeaways: ['God made everything.'],
  historicalContext: 'Genesis opens the Bible.',
  crossReferences: [{ reference: 'John 1:1', note: 'Jesus at creation.' }],
  pronunciationHints: [],
}

describe('ReflectTogether', () => {
  it('renders themes, takeaways, context and cross-references', () => {
    render(<ReflectTogether content={content} />)
    expect(screen.getByText('God is Creator')).toBeInTheDocument()
    expect(screen.getByText('God made everything.')).toBeInTheDocument()
    expect(screen.getByText(/Genesis opens the Bible/)).toBeInTheDocument()
    expect(screen.getByText(/John 1:1/)).toBeInTheDocument()
  })

  it('omits context section when absent', () => {
    render(<ReflectTogether content={{ ...content, historicalContext: undefined }} />)
    expect(screen.queryByText(/A little history/)).not.toBeInTheDocument()
  })
})
