import type { AgeBandContent } from '@/content/schema'

export function ReflectTogether({ content }: { content: AgeBandContent }) {
  return (
    <section className="card mt-10 px-6 py-6 text-base sm:px-7">
      <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-[var(--accent)]">
        <span aria-hidden="true">💬</span> Reflect together
      </h2>

      <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--accent-2)]">
        Themes
      </h3>
      <ul className="mb-5 space-y-1.5">
        {content.themes.map((t) => (
          <li key={t} className="flex gap-2.5">
            <span aria-hidden="true" className="text-[var(--accent)]">
              •
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ul>

      <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--accent-2)]">
        What we learn
      </h3>
      <ul className="mb-5 space-y-1.5">
        {content.takeaways.map((t) => (
          <li key={t} className="flex gap-2.5">
            <span aria-hidden="true" className="text-[var(--accent)]">
              ★
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ul>

      {content.historicalContext && (
        <>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--accent-2)]">
            A little history
          </h3>
          <p className="mb-5 text-[var(--muted)]">{content.historicalContext}</p>
        </>
      )}

      {content.crossReferences.length > 0 && (
        <>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--accent-2)]">
            Related verses
          </h3>
          <ul className="space-y-1.5">
            {content.crossReferences.map((c) => (
              <li key={c.reference} className="flex gap-2.5">
                <span aria-hidden="true" className="text-[var(--accent)]">
                  📖
                </span>
                <span>
                  <strong className="text-[var(--ink)]">{c.reference}</strong> — {c.note}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
