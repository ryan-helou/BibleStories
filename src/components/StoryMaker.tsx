'use client'
import { useRef, useState } from 'react'
import { StoryBody } from '@/components/StoryBody'
import { NarrationButton } from '@/components/NarrationButton'
import { MoonIcon, StarIcon } from '@/components/icons'
import {
  CustomStoryRequestSchema,
  bandVoice,
  categorizeAge,
  parseGeneratedStory,
  type Verse,
} from '@/lib/customStory'

const LENGTH_OPTIONS = [1, 2, 3, 5, 8, 12] as const

// The core story-maker: age + focus + length -> a streamed, narratable story.
// Self-contained so it can live on the landing page and on /create alike.
export function StoryMaker() {
  const [age, setAge] = useState('6')
  const [description, setDescription] = useState('')
  const [minutes, setMinutes] = useState(3)
  const [story, setStory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [genId, setGenId] = useState(0)
  const [verse, setVerse] = useState<Verse | null>(null)
  const [verseLoading, setVerseLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  // After the story finishes, Sonnet supplies an accurate passage verse.
  async function fetchVerse(description: string, storyText: string) {
    setVerse(null)
    setVerseLoading(true)
    try {
      const res = await fetch('/api/verse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, story: storyText }),
      })
      if (res.ok) setVerse(await res.json())
    } catch {
      // A missing verse shouldn't break the story; just show none.
    } finally {
      setVerseLoading(false)
    }
  }

  const ageNum = Number(age)
  const bandLabel =
    Number.isFinite(ageNum) && ageNum >= 1 ? bandVoice(categorizeAge(ageNum)).label : null

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

    setStory('')
    setVerse(null)
    setVerseLoading(false)
    setGenId((n) => n + 1)
    setLoading(true)
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
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
        const chunk = decoder.decode(value, { stream: true })
        acc += chunk
        setStory((prev) => prev + chunk)
      }

      // Story is complete — now get an accurate verse from Sonnet.
      const finalStory = parseGeneratedStory(acc).story
      void fetchVerse(parsed.data.description, finalStory)
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError((err as Error).message)
      }
    } finally {
      setLoading(false)
      abortRef.current = null
    }
  }

  function handleStop() {
    abortRef.current?.abort()
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

      {error && <p className="callout mt-6 text-[var(--accent-2)]">{error}</p>}

      {(story || loading) && (
        <StoryResult
          story={story}
          loading={loading}
          genId={genId}
          verse={verse}
          verseLoading={verseLoading}
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
}: {
  story: string
  loading: boolean
  genId: number
  verse: Verse | null
  verseLoading: boolean
}) {
  const { story: text, takeaways } = parseGeneratedStory(story)
  const narrationText = verse ? `${text}\n\n${verse.text}` : text

  return (
    <article
      aria-live="polite"
      className="card rise mt-6 overflow-hidden"
    >
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

        {!loading && takeaways.length > 0 && (
          <section className="mt-8 border-t border-[var(--line-soft)] pt-6">
            <h3 className="mb-3 font-semibold text-[var(--accent)]">Things to remember</h3>
            <ul className="space-y-2.5">
              {takeaways.map((t, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex-none text-[var(--accent)]" aria-hidden="true">
                    <StarIcon size={16} filled />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {!loading && (verseLoading || verse) && (
          <section className="callout mt-7">
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
              <p className="mt-2 text-sm text-[var(--muted)]">Finding a verse from the passage…</p>
            )}
          </section>
        )}

        {!loading && text && (
          <div className="hr-star mt-8 text-sm">
            <MoonIcon size={15} /> The end. Sweet dreams.
          </div>
        )}
      </div>
    </article>
  )
}
