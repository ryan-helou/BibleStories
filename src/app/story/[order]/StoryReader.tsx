'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import type { Story } from '@/content/schema'
import { StoryBody } from '@/components/StoryBody'
import { PronunciationHints } from '@/components/PronunciationHints'
import { ReflectTogether } from '@/components/ReflectTogether'
import { AgeBandPicker } from '@/components/AgeBandPicker'
import { NarrationButton } from '@/components/NarrationButton'
import { BookIcon, StarIcon } from '@/components/icons'
import { useAgeBand } from '@/lib/useAgeBand'
import { useProgress } from '@/lib/useProgress'

export function StoryReader({
  story,
  prevOrder,
  nextOrder,
}: {
  story: Story
  prevOrder: number | null
  nextOrder: number | null
}) {
  const { ageBand, setAgeBand } = useAgeBand()
  const { progress, markRead, toggleFavorite, setLastRead } = useProgress()
  const content = story.bands[ageBand]

  useEffect(() => {
    markRead(story.order)
    setLastRead(story.order)
  }, [story.order, markRead, setLastRead])

  const isFav = progress.favorites.includes(story.order)

  return (
    <article className="rise mx-auto max-w-2xl">
      <div className="mb-5 flex items-center justify-between text-sm">
        <Link href="/library" className="font-semibold text-[var(--accent)] hover:text-[var(--ink)]">
          ← Library
        </Link>
        <button
          type="button"
          onClick={() => toggleFavorite(story.order)}
          aria-pressed={isFav}
          aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
          className={`btn text-sm ${isFav ? 'btn-soft' : 'btn-ghost'}`}
        >
          <StarIcon size={15} filled={isFav} /> {isFav ? 'Favorited' : 'Favorite'}
        </button>
      </div>

      <header className="mb-6">
        <span className="badge mb-2">{story.era}</span>
        <h1 className="text-3xl font-semibold leading-tight">{story.title}</h1>
        <p className="mt-1.5 flex items-center gap-1.5 text-[var(--muted)]">
          <BookIcon size={16} /> {story.sourcePassage}
        </p>
      </header>

      <div className="mb-6">
        <AgeBandPicker value={ageBand} onChange={setAgeBand} />
      </div>

      <PronunciationHints hints={content.pronunciationHints} />

      <div className="mb-6">
        <NarrationButton text={content.body} resetKey={`${story.order}-${ageBand}`} />
      </div>

      <div className="card px-6 py-7 sm:px-7">
        <div className="prose-story">
          <StoryBody body={content.body} dropcap />
        </div>
      </div>

      <ReflectTogether content={content} />

      <nav className="mt-10 flex justify-between gap-3">
        {prevOrder != null ? (
          <Link href={`/story/${prevOrder}`} className="btn btn-ghost text-sm">
            ← Previous
          </Link>
        ) : (
          <span />
        )}
        {nextOrder != null ? (
          <Link href={`/story/${nextOrder}`} className="btn btn-soft text-sm">
            Next →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  )
}
