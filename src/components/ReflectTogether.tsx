import type { AgeBandContent } from '@/content/schema'

export function ReflectTogether({ content }: { content: AgeBandContent }) {
  return (
    <section className="mt-10 border-t border-[var(--surface)] pt-6 text-base">
      <h2 className="mb-4 text-lg font-bold text-[var(--accent)]">Reflect together</h2>

      <h3 className="font-semibold">Themes</h3>
      <ul className="mb-4 list-disc pl-5">
        {content.themes.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      <h3 className="font-semibold">What we learn</h3>
      <ul className="mb-4 list-disc pl-5">
        {content.takeaways.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      {content.historicalContext && (
        <>
          <h3 className="font-semibold">A little history</h3>
          <p className="mb-4">{content.historicalContext}</p>
        </>
      )}

      {content.crossReferences.length > 0 && (
        <>
          <h3 className="font-semibold">Related verses</h3>
          <ul className="list-disc pl-5">
            {content.crossReferences.map((c) => (
              <li key={c.reference}>
                <strong>{c.reference}</strong> — {c.note}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
