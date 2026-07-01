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
          className={`lamplight flex-1 rounded-2xl border px-4 py-3 text-left ${
            value === b.key
              ? 'border-[var(--accent)] bg-[var(--surface-2)] shadow-[0_0_0_1px_rgba(255,210,122,0.4)]'
              : 'border-[var(--line)] bg-[var(--surface)]'
          }`}
        >
          <span className="block font-semibold">{b.label}</span>
          <span className="mt-0.5 block text-sm text-[var(--muted)]">{b.blurb}</span>
        </button>
      ))}
    </div>
  )
}
