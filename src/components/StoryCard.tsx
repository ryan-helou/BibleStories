import Link from 'next/link'
import type { Story } from '@/content/schema'
import { StarIcon } from '@/components/icons'

export function StoryCard({ story, isRead }: { story: Story; isRead: boolean }) {
  return (
    <Link href={`/story/${story.order}`} className="card lift group block px-4 py-3.5">
      <div className="flex items-start gap-3.5">
        {/* Order chip — a numbered stepping-stone through the whole Bible. */}
        <span
          aria-hidden="true"
          className={`mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-xl border text-sm font-semibold ${
            isRead
              ? 'border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)]'
              : 'border-[var(--line)] bg-[var(--surface)] text-[var(--muted)]'
          }`}
        >
          {story.order}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <span className="font-semibold">{story.title}</span>
            <span
              className={`flex-none ${isRead ? 'text-[var(--accent)]' : 'text-[var(--faint)]'}`}
              aria-label={isRead ? 'Read' : 'Not read yet'}
              title={isRead ? 'Read' : 'Not read yet'}
            >
              <StarIcon size={16} filled={isRead} />
            </span>
          </div>
          <span className="mt-0.5 block text-sm text-[var(--faint)]">{story.sourcePassage}</span>
          <span className="mt-1 block text-sm text-[var(--muted)]">{story.teaser}</span>
        </div>
      </div>
    </Link>
  )
}
