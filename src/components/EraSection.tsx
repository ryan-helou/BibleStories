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
      <h2 className="mb-3 text-lg font-bold text-[var(--accent)]">{era}</h2>
      <div className="flex flex-col gap-3">
        {stories.map((s) => (
          <StoryCard key={s.order} story={s} isRead={readSet.has(s.order)} />
        ))}
      </div>
    </section>
  )
}
