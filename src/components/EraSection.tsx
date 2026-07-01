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
    <section className="mb-8">
      <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-[var(--accent-2)]">
        <span aria-hidden="true" className="h-px flex-none w-4 bg-[var(--line)]" />
        {era}
      </h2>
      <div className="flex flex-col gap-3">
        {stories.map((s) => (
          <StoryCard key={s.order} story={s} isRead={readSet.has(s.order)} />
        ))}
      </div>
    </section>
  )
}
