import Link from 'next/link'
import type { Story } from '@/content/schema'

export function StoryCard({ story, isRead }: { story: Story; isRead: boolean }) {
  return (
    <Link
      href={`/story/${story.order}`}
      className="block rounded-xl border border-[var(--surface)] bg-[var(--surface)] px-4 py-3"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold">{story.title}</span>
        {isRead && <span aria-label="read" title="Read">✓</span>}
      </div>
      <span className="block text-sm text-[var(--muted)]">{story.sourcePassage}</span>
      <span className="block text-sm">{story.teaser}</span>
    </Link>
  )
}
