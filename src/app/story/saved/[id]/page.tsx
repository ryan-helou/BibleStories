'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { StoryBody } from '@/components/StoryBody'
import { NarrationButton } from '@/components/NarrationButton'
import { BookIcon, MoonIcon, StarIcon } from '@/components/icons'
import { bandVoice } from '@/lib/customStory'
import {
  deleteSavedStory,
  getSavedStory,
  savedStoryTitle,
  toggleSavedFavorite,
  type SavedStory,
} from '@/lib/savedStories'

export default function SavedStoryPage() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)
  const [story, setStory] = useState<SavedStory | undefined>(undefined)

  useEffect(() => {
    setStory(getSavedStory(id))
    setLoaded(true)
  }, [id])

  // Avoid a flash of "not found" before localStorage is read on the client.
  if (!loaded) return <main className="mx-auto max-w-2xl" />

  if (!story) {
    return (
      <main className="rise mx-auto max-w-2xl">
        <p className="text-[var(--muted)]">That story isn&apos;t saved anymore.</p>
        <Link href="/library" className="btn btn-soft mt-4 text-sm">
          ← Back to the library
        </Link>
      </main>
    )
  }

  const s = story
  const narrationText = s.verse ? `${s.story}\n\n${s.verse.text}` : s.story

  function handleFavorite() {
    toggleSavedFavorite(s.id)
    setStory(getSavedStory(s.id))
  }

  function handleDelete() {
    deleteSavedStory(s.id)
    router.push('/library')
  }

  return (
    <article className="rise mx-auto max-w-2xl">
      <div className="mb-5 flex items-center justify-end text-sm">
        <button
          type="button"
          onClick={handleFavorite}
          aria-pressed={s.favorite}
          aria-label={s.favorite ? 'Remove favorite' : 'Add favorite'}
          className={`btn text-sm ${s.favorite ? 'btn-soft' : 'btn-ghost'}`}
        >
          <StarIcon size={15} filled={s.favorite} /> {s.favorite ? 'Favorited' : 'Favorite'}
        </button>
      </div>

      <header className="mb-6">
        <span className="badge mb-2">Just for tonight · {bandVoice(s.band).label}</span>
        <h1 className="text-3xl font-semibold leading-tight">{savedStoryTitle(s)}</h1>
        <p className="mt-1.5 flex items-center gap-1.5 text-[var(--muted)]">
          <BookIcon size={16} /> A story you made · about {s.minutes} min
        </p>
      </header>

      <div className="mb-6">
        <NarrationButton text={narrationText} resetKey={s.id} />
      </div>

      <div className="card px-6 py-7 sm:px-7">
        <div className="prose-story">
          <StoryBody body={s.story} dropcap />
        </div>
      </div>

      {(s.takeaways.length > 0 || s.verse) && (
        <section className="mt-8 border-t border-[var(--line-soft)] pt-6">
          <h2 className="mb-4 text-lg font-bold text-[var(--accent)]">Reflect together</h2>
          {s.takeaways.length > 0 && (
            <>
              <h3 className="mb-3 font-semibold">What we learn</h3>
              <ul className="mb-4 space-y-2.5">
                {s.takeaways.map((t, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 flex-none text-[var(--accent)]" aria-hidden="true">
                      <StarIcon size={16} filled />
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {s.verse && (
            <div className="callout mt-2">
              <span className="eyebrow">A verse for tonight</span>
              <p className="prose-story mt-2 text-xl italic leading-relaxed">
                &ldquo;{s.verse.text}&rdquo;
              </p>
              {s.verse.reference && (
                <p className="mt-1.5 text-sm font-semibold text-[var(--muted)]">
                  {s.verse.reference}
                </p>
              )}
            </div>
          )}
        </section>
      )}

      <div className="hr-star mt-8 text-sm">
        <MoonIcon size={15} /> The end. Sweet dreams.
      </div>

      <nav className="mt-8 flex items-center justify-between gap-3 text-sm">
        <Link href="/create" className="btn btn-soft">
          Make another story
        </Link>
        <button type="button" onClick={handleDelete} className="btn btn-ghost text-[var(--muted)]">
          Remove this story
        </button>
      </nav>
    </article>
  )
}
