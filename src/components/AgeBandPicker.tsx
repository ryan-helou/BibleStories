'use client'
import { AGE_BANDS } from '@/content/ageBands'
import type { AgeBand } from '@/content/schema'

export function AgeBandPicker({
  value,
  onChange,
}: {
  value: AgeBand
  onChange: (band: AgeBand) => void
}) {
  return (
    <div
      className="grid gap-3 sm:grid-cols-3"
      role="group"
      aria-label="Choose child's age"
    >
      {AGE_BANDS.map((b) => (
        <button
          key={b.key}
          type="button"
          aria-pressed={value === b.key}
          onClick={() => onChange(b.key)}
          className="opt px-4 py-3 text-left"
        >
          <span className="block font-semibold">{b.label}</span>
          <span className="mt-1 block text-sm font-normal text-[var(--muted)]">{b.blurb}</span>
        </button>
      ))}
    </div>
  )
}
