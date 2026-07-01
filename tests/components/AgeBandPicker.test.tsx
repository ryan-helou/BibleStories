import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AgeBandPicker } from '@/components/AgeBandPicker'

describe('AgeBandPicker', () => {
  it('renders all three bands and marks the selected one', () => {
    render(<AgeBandPicker value="6-8" onChange={() => {}} />)
    expect(screen.getByRole('button', { name: /Ages 3–5/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Ages 6–8/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /Ages 9–12/ })).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onChange with the chosen band', async () => {
    const onChange = vi.fn()
    render(<AgeBandPicker value="6-8" onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: /Ages 9–12/ }))
    expect(onChange).toHaveBeenCalledWith('9-12')
  })
})
