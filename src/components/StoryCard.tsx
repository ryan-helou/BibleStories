import Link from 'next/link'
import type { Story } from '@/content/schema'

export function StoryCard({ story, isRead }: { story: Story; isRead: boolean }) {
  return (
    <Link
      href={`/story/${story.order}`}
      className="lamplight block rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold">{story.title}</span>
        <span
          className={isRead ? 'text-[var(--accent)]' : 'text-[var(--line)]'}
          aria-label={isRead ? 'Read' : 'Not read yet'}
          title={isRead ? 'Read' : 'Not read yet'}
        >
          {isRead ? '⭐' : '☆'}
        </span>
      </div>
      <span className="mt-0.5 block text-sm text-[var(--muted)]">{story.sourcePassage}</span>
      <span className="mt-1 block text-sm">{story.teaser}</span>
    </Link>
  )
}
