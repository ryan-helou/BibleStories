'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllStories, getStoryByOrder } from '@/content/library'
import { ERAS } from '@/content/eras'
import { EraSection } from '@/components/EraSection'
import { StoryCard } from '@/components/StoryCard'
import { AgeBandPicker } from '@/components/AgeBandPicker'
import { useAgeBand } from '@/lib/useAgeBand'
import { useProgress } from '@/lib/useProgress'
import { loadSavedStories, savedStoryTitle, type SavedStory } from '@/lib/savedStories'
import { ArrowRightIcon, BookIcon, SparkleIcon, StarIcon } from '@/components/icons'

export default function LibraryPage() {
  const stories = getAllStories()
  const { ageBand, setAgeBand } = useAgeBand()
  const { progress } = useProgress()
  const readSet = new Set(progress.read)
  const last = progress.lastRead

  // Generated stories live in localStorage — load them after mount.
  const [saved, setSaved] = useState<SavedStory[]>([])
  useEffect(() => setSaved(loadSavedStories()), [])

  const favLibrary = stories.filter((s) => progress.favorites.includes(s.order))
  const favSaved = saved.filter((s) => s.favorite)
  const hasFavorites = favLibrary.length > 0 || favSaved.length > 0

  return (
    <main className="mx-auto max-w-2xl">
      <header className="rise mb-7">
        <span className="eyebrow mb-2">The whole Bible</span>
        <h1 className="text-3xl font-semibold">
          The story <span className="text-[var(--accent)]">library</span>
        </h1>
        <p className="mt-1.5 text-[var(--muted)]">
          The whole Bible, in order, told gently for your child.
        </p>
      </header>

      <Link
        href="/create"
        className="lift rise-2 mb-4 flex items-center gap-4 rounded-3xl border border-[rgba(255,210,122,0.4)] bg-gradient-to-b from-[var(--surface-2)] to-[var(--surface)] px-6 py-5 shadow-[var(--shadow-card)]"
      >
        <span
          aria-hidden="true"
          className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-[var(--accent)]/12 text-[var(--accent)]"
        >
          <SparkleIcon size={24} />
        </span>
        <span className="flex-1">
          <span className="block text-xl font-semibold text-[var(--accent)]">
            Make a story just for tonight
          </span>
          <span className="mt-0.5 block text-sm text-[var(--muted)]">
            Any story, any focus, in the length you choose.
          </span>
        </span>
        <span aria-hidden="true" className="flex-none text-[var(--accent)]">
          <ArrowRightIcon size={18} />
        </span>
      </Link>

      <p className="mb-9 px-1 text-sm text-[var(--muted)]">
        Library stories are a gentle, fixed length. In{' '}
        <Link href="/create" className="font-semibold text-[var(--accent)]">
          Create
        </Link>{' '}
        you choose the age and the exact minutes.
      </p>

      <div className="mb-9">
        <p className="mb-2 text-sm font-semibold">Who are we reading to tonight?</p>
        <AgeBandPicker value={ageBand} onChange={setAgeBand} />
      </div>

      {last != null && (
        <Link
          href={`/story/${last}`}
          className="card lift mb-9 flex items-center gap-3 px-4 py-3 font-semibold"
        >
          <span aria-hidden="true" className="text-[var(--accent)]">
            <BookIcon size={18} />
          </span>
          Pick up where you left off
          {getStoryByOrder(last) && (
            <span className="font-normal text-[var(--muted)]">· {getStoryByOrder(last)!.title}</span>
          )}
          <span aria-hidden="true" className="ml-auto text-[var(--accent)]">
            <ArrowRightIcon size={18} />
          </span>
        </Link>
      )}

      {saved.length > 0 && (
        <section className="mb-9">
          <h2 className="mb-4 text-lg font-semibold">Stories you&apos;ve made</h2>
          <div className="flex flex-col gap-3">
            {saved.map((s) => (
              <Link
                key={s.id}
                href={`/story/saved/${s.id}`}
                className="card lift flex items-center gap-3 px-4 py-3"
              >
                <span aria-hidden="true" className="flex-none text-[var(--accent)]">
                  <SparkleIcon size={18} />
                </span>
                <span className="flex-1">
                  <span className="block font-semibold">{savedStoryTitle(s)}</span>
                  <span className="block text-sm text-[var(--muted)]">
                    about {s.minutes} min · {s.favorite ? 'favorited' : 'saved'}
                  </span>
                </span>
                <span aria-hidden="true" className="flex-none text-[var(--accent)]">
                  <ArrowRightIcon size={18} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {hasFavorites && (
        <section className="mb-9">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <StarIcon size={16} filled /> Favorites
          </h2>
          <div className="flex flex-col gap-3">
            {favLibrary.map((s) => (
              <StoryCard key={`lib-${s.order}`} story={s} isRead={readSet.has(s.order)} />
            ))}
            {favSaved.map((s) => (
              <Link
                key={`saved-${s.id}`}
                href={`/story/saved/${s.id}`}
                className="card lift flex items-center gap-3 px-4 py-3"
              >
                <span aria-hidden="true" className="flex-none text-[var(--accent)]">
                  <SparkleIcon size={18} />
                </span>
                <span className="flex-1 font-semibold">{savedStoryTitle(s)}</span>
                <span aria-hidden="true" className="flex-none text-[var(--accent)]">
                  <ArrowRightIcon size={18} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">The whole story, in order</h2>
        <span className="badge">
          <StarIcon size={13} filled /> {readSet.size} read
        </span>
      </div>

      {ERAS.map((era) => (
        <EraSection
          key={era}
          era={era}
          stories={stories.filter((s) => s.era === era)}
          readSet={readSet}
        />
      ))}
    </main>
  )
}
