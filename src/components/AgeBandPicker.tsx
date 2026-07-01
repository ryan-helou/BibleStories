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
    <div className="flex flex-wrap gap-3" role="group" aria-label="Choose child's age">
      {AGE_BANDS.map((b) => (
        <button
          key={b.key}
          type="button"
          aria-pressed={value === b.key}
          onClick={() => onChange(b.key)}
          className={`rounded-xl border px-4 py-3 text-left transition ${
            value === b.key ? 'border-[var(--accent)] bg-[var(--surface)]' : 'border-transparent'
          }`}
        >
          <span className="block font-semibold">{b.label}</span>
          <span className="block text-sm text-[var(--muted)]">{b.blurb}</span>
        </button>
      ))}
    </div>
  )
}
