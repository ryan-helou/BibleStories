'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { StoryBody } from '@/components/StoryBody'
import { NarrationButton } from '@/components/NarrationButton'
import { MoonIcon, StarIcon } from '@/components/icons'
import { useAgeBand } from '@/lib/useAgeBand'
import { addSavedStory, updateSavedStory } from '@/lib/savedStories'
import type { AgeBand } from '@/content/schema'
import {
  CustomStoryRequestSchema,
  bandVoice,
  categorizeAge,
  parseGeneratedStory,
  type CustomStoryRequest,
  type Verse,
} from '@/lib/customStory'

const LENGTH_OPTIONS = [1, 2, 3, 5, 8, 12] as const

// A representative age for each band, used to seed the age field from the
// band the parent already chose in the library — so they never answer twice.
const BAND_TO_AGE: Record<AgeBand, string> = { '3-5': '4', '6-8': '7', '9-12': '10' }

// Turn a raw server/network error into something a tired parent can act on.
function friendlyError(message: string): string {
  if (/ANTHROPIC_API_KEY/i.test(message)) {
    return "The story service isn't switched on yet. Please try again a little later."
  }
  return "We couldn't write tonight's story. Please try again."
}

// The core story-maker: age + focus + length -> a streamed, narratable story.
// Self-contained so it can live on the landing page and on /create alike.
export function StoryMaker() {
  const { ageBand } = useAgeBand()
  const [age, setAge] = useState('6')
  const [description, setDescription] = useState('')
  const [minutes, setMinutes] = useState(3)
  const [story, setStory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [genId, setGenId] = useState(0)
  const [verse, setVerse] = useState<Verse | null>(null)
  const [verseLoading, setVerseLoading] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)

  const abortRef = useRef<AbortController | null>(null)
  const verseAbortRef = useRef<AbortController | null>(null)
  const verseTokenRef = useRef(0)
  const lastRequestRef = useRef<CustomStoryRequest | null>(null)
  const seededRef = useRef(false)

  // Seed the age field once from the band the parent picked in the library.
  useEffect(() => {
    if (!seededRef.current) {
      seededRef.current = true
      setAge(BAND_TO_AGE[ageBand])
    }
  }, [ageBand])

  // Stop any in-flight work if the parent navigates away mid-story.
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      verseAbortRef.current?.abort()
    }
  }, [])

  // After the story finishes, Sonnet supplies an accurate passage verse.
  // `token` guards the UI so a slow verse from an earlier story can't land on a
  // newer one; `saveId` attaches the verse to the right saved record regardless.
  async function fetchVerse(desc: string, storyText: string, token: number, saveId: string | null) {
    setVerse(null)
    setVerseLoading(true)
    const controller = new AbortController()
    verseAbortRef.current = controller
    try {
      const res = await fetch('/api/verse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: desc, story: storyText }),
        signal: controller.signal,
      })
      if (!res.ok) return
      const v: Verse = await res.json()
      if (saveId) updateSavedStory(saveId, { verse: v })
      if (verseTokenRef.current === token) setVerse(v)
    } catch {
      // A missing verse shouldn't break the story; just show none.
    } finally {
      if (verseTokenRef.current === token) setVerseLoading(false)
    }
  }

  const ageNum = Number(age)
  const bandLabel =
    Number.isFinite(ageNum) && ageNum >= 1 ? bandVoice(categorizeAge(ageNum)).label : null

  async function runGeneration(request: CustomStoryRequest) {
    lastRequestRef.current = request
    setError(null)
    setStory('')
    setVerse(null)
    setVerseLoading(false)
    setSavedId(null)
    const token = verseTokenRef.current + 1
    verseTokenRef.current = token
    setGenId((n) => n + 1)
    setLoading(true)
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error ?? `Request failed (${res.status}).`)
      }
      if (!res.body) throw new Error('No response stream.')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setStory(acc)
      }

      // Story is complete — persist it so it can be re-read on later nights,
      // then ask Sonnet for an accurate verse from the passage.
      const parsedOut = parseGeneratedStory(acc)
      const band = categorizeAge(request.age)
      const saved = addSavedStory({
        description: request.description,
        age: request.age,
        band,
        minutes: request.minutes,
        story: parsedOut.story,
        takeaways: parsedOut.takeaways,
        verse: parsedOut.verse,
      })
      setSavedId(saved.id)
      void fetchVerse(request.description, parsedOut.story, token, saved.id)
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError(friendlyError((err as Error).message))
      }
    } finally {
      setLoading(false)
      abortRef.current = null
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const parsed = CustomStoryRequestSchema.safeParse({
      age: Number(age),
      description,
      minutes,
    })
    if (!parsed.success) {
      const first = Object.values(parsed.error.flatten().fieldErrors).flat()[0]
      setError(first ?? 'Please check your inputs.')
      return
    }
    void runGeneration(parsed.data)
  }

  function handleRetry() {
    if (lastRequestRef.current) void runGeneration(lastRequestRef.current)
  }

  function handleStop() {
    abortRef.current?.abort()
    verseAbortRef.current?.abort()
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="card-glass space-y-6 p-6 sm:p-7">
        <div>
          <label htmlFor="age" className="mb-2 block text-sm font-semibold">
            Child&apos;s age
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <input
              id="age"
              type="number"
              min={1}
              max={17}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="field w-24 text-center text-lg font-semibold"
            />
            {bandLabel && (
              <span className="badge">We&apos;ll write it for {bandLabel}</span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="mb-2 block text-sm font-semibold">
            What story would you like?
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. The story of Daniel — focus on his faith through temptation and his resilience."
            className="field resize-none"
          />
          <div className="mt-2 flex flex-wrap gap-2" aria-label="Story ideas">
            {['Daniel and the lions', 'The Good Shepherd', 'Jonah and the big fish', 'Baby Moses'].map(
              (idea) => (
                <button
                  key={idea}
                  type="button"
                  onClick={() => setDescription(idea)}
                  className="opt px-3 py-1.5 text-sm"
                >
                  {idea}
                </button>
              ),
            )}
          </div>
        </div>

        <div>
          <span className="mb-2 block text-sm font-semibold">How long? (read-aloud time)</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Story length">
            {LENGTH_OPTIONS.map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={minutes === m}
                onClick={() => setMinutes(m)}
                className="opt px-4 py-2"
              >
                {m} min
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-1">
          <button type="submit" disabled={loading} className="btn btn-primary btn-lg">
            {loading ? 'Writing your story…' : 'Create story'}
          </button>
          {loading && (
            <button type="button" onClick={handleStop} className="btn btn-ghost">
              Stop
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="callout mt-6 flex flex-wrap items-center gap-3 text-[var(--accent-2)]">
          <span>{error}</span>
          {lastRequestRef.current && (
            <button type="button" onClick={handleRetry} className="btn btn-soft text-sm">
              Try again
            </button>
          )}
        </div>
      )}

      {(story || loading) && (
        <StoryResult
          story={story}
          loading={loading}
          genId={genId}
          verse={verse}
          verseLoading={verseLoading}
          savedId={savedId}
        />
      )}
    </div>
  )
}

function StoryResult({
  story,
  loading,
  genId,
  verse,
  verseLoading,
  savedId,
}: {
  story: string
  loading: boolean
  genId: number
  verse: Verse | null
  verseLoading: boolean
  savedId: string | null
}) {
  const { story: text, takeaways } = parseGeneratedStory(story)
  const narrationText = verse ? `${text}\n\n${verse.text}` : text

  return (
    <article aria-live="polite" className="card rise mt-6 overflow-hidden">
      {/* A slim lit header bar makes the result feel like an opened storybook. */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--line-soft)] bg-[var(--surface-2)]/40 px-6 py-3">
        <span className="eyebrow">Tonight&apos;s story</span>
        {!loading && text && <NarrationButton text={narrationText} resetKey={String(genId)} />}
      </div>

      <div className="px-6 py-6 sm:px-7">
        {loading && !text && <p className="italic text-[var(--muted)]">Once upon a time…</p>}
        <div className="prose-story">
          <StoryBody body={text} dropcap={!loading || text.length > 40} />
        </div>
        {loading && text && (
          <span className="caret text-[var(--accent)]" aria-hidden="true">
            ▍
          </span>
        )}

        {/* Post-story section — same "Reflect together" language as library stories. */}
        {!loading && (takeaways.length > 0 || verseLoading || verse) && (
          <section className="mt-8 border-t border-[var(--line-soft)] pt-6">
            <h2 className="mb-4 text-lg font-bold text-[var(--accent)]">Reflect together</h2>

            {takeaways.length > 0 && (
              <>
                <h3 className="mb-3 font-semibold">What we learn</h3>
                <ul className="mb-4 space-y-2.5">
                  {takeaways.map((t, i) => (
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

            {(verseLoading || verse) && (
              <div className="callout mt-2">
                <span className="eyebrow">A verse for tonight</span>
                {verse ? (
                  <>
                    <p className="prose-story mt-2 text-xl italic leading-relaxed">
                      &ldquo;{verse.text}&rdquo;
                    </p>
                    {verse.reference && (
                      <p className="mt-1.5 text-sm font-semibold text-[var(--muted)]">
                        {verse.reference}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Finding a verse from the passage…
                  </p>
                )}
              </div>
            )}
          </section>
        )}

        {!loading && text && (
          <>
            {savedId && (
              <p className="mt-6 flex items-center gap-2 text-sm text-[var(--muted)]">
                <StarIcon size={14} filled />
                Saved — read it again anytime from{' '}
                <Link href="/library" className="font-semibold text-[var(--accent)]">
                  your library
                </Link>
                .
              </p>
            )}
            <div className="hr-star mt-8 text-sm">
              <MoonIcon size={15} /> The end. Sweet dreams.
            </div>
          </>
        )}
      </div>
    </article>
  )
}
