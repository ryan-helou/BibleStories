import type { PronunciationHint } from '@/content/schema'

export function PronunciationHints({ hints }: { hints: PronunciationHint[] }) {
  if (hints.length === 0) return null
  return (
    <details className="mb-4 text-sm text-[var(--muted)]">
      <summary className="cursor-pointer">How do I say the names?</summary>
      <ul className="mt-2 list-disc pl-5">
        {hints.map((h) => (
          <li key={h.name}>
            <strong>{h.name}</strong> — {h.pronunciation}
          </li>
        ))}
      </ul>
    </details>
  )
}
