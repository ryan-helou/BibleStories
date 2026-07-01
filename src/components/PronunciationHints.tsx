import type { PronunciationHint } from '@/content/schema'

export function PronunciationHints({ hints }: { hints: PronunciationHint[] }) {
  if (hints.length === 0) return null
  return (
    <details className="card mb-6 px-4 py-3 text-sm text-[var(--muted)]">
      <summary className="cursor-pointer select-none font-semibold text-[var(--ink)]">
        <span aria-hidden="true" className="mr-1.5">
          🗣️
        </span>
        How do I say the names?
      </summary>
      <ul className="mt-3 space-y-1.5">
        {hints.map((h) => (
          <li key={h.name} className="flex gap-2.5">
            <span aria-hidden="true" className="text-[var(--accent)]">
              •
            </span>
            <span>
              <strong className="text-[var(--ink)]">{h.name}</strong> — {h.pronunciation}
            </span>
          </li>
        ))}
      </ul>
    </details>
  )
}
