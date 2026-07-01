'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import type { Story } from '@/content/schema'
import { StoryBody } from '@/components/StoryBody'
import { PronunciationHints } from '@/components/PronunciationHints'
import { ReflectTogether } from '@/components/ReflectTogether'
import { AgeBandPicker } from '@/components/AgeBandPicker'
import { NarrationButton } from '@/components/NarrationButton'
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
    <article>
      <div className="mb-4 flex items-center justify-between text-sm">
        <Link href="/library" className="text-[var(--accent)]">← Library</Link>
        <button
          type="button"
          onClick={() => toggleFavorite(story.order)}
          aria-pressed={isFav}
          aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
        >
          {isFav ? '★ Favorited' : '☆ Favorite'}
        </button>
      </div>

      <h1 className="text-2xl font-bold">{story.title}</h1>
      <p className="mb-4 text-[var(--muted)]">{story.sourcePassage}</p>

      <div className="mb-6">
        <AgeBandPicker value={ageBand} onChange={setAgeBand} />
      </div>

      <PronunciationHints hints={content.pronunciationHints} />

      <div className="mb-5">
        <NarrationButton text={content.body} resetKey={`${story.order}-${ageBand}`} />
      </div>

      <StoryBody body={content.body} />
      <ReflectTogether content={content} />

      <nav className="mt-10 flex justify-between text-[var(--accent)]">
        {prevOrder != null ? <Link href={`/story/${prevOrder}`}>← Previous</Link> : <span />}
        {nextOrder != null ? <Link href={`/story/${nextOrder}`}>Next →</Link> : <span />}
      </nav>
    </article>
  )
}
