import type { Era, Story } from '@/content/schema'
import { StoryCard } from './StoryCard'

export function EraSection({
  era,
  stories,
  readSet,
}: {
  era: Era
  stories: Story[]
  readSet: Set<number>
}) {
  if (stories.length === 0) return null
  return (
    <section className="mb-9">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="flex-none text-base font-semibold uppercase tracking-[0.14em] text-[var(--accent-2)]">
          {era}
        </h2>
        <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-[var(--line)] to-transparent" />
        <span aria-hidden="true" className="flex-none text-xs text-[var(--faint)]">
          {stories.length}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {stories.map((s) => (
          <StoryCard key={s.order} story={s} isRead={readSet.has(s.order)} />
        ))}
      </div>
    </section>
  )
}
