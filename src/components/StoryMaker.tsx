'use client'
import { useRef, useState } from 'react'
import { StoryBody } from '@/components/StoryBody'
import { NarrationButton } from '@/components/NarrationButton'
import { CustomStoryRequestSchema, bandVoice, categorizeAge } from '@/lib/customStory'

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
  const abortRef = useRef<AbortController | null>(null)

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
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        setStory((prev) => prev + decoder.decode(value, { stream: true }))
      }
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
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="age" className="mb-1 block text-sm font-semibold">
            Child&apos;s age
          </label>
          <input
            id="age"
            type="number"
            min={1}
            max={17}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-28 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-[var(--ink)]"
          />
          {bandLabel && (
            <span className="ml-3 text-sm text-[var(--muted)]">
              We&apos;ll write it for {bandLabel}.
            </span>
          )}
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-semibold">
            What story would you like?
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. The story of Daniel — focus on his faith through temptation and his resilience."
            className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-[var(--ink)] placeholder:text-[var(--muted)]"
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
                className={`lamplight rounded-2xl border px-4 py-2 font-semibold ${
                  minutes === m
                    ? 'border-[var(--accent)] bg-[var(--surface-2)] text-[var(--accent)] shadow-[0_0_0_1px_rgba(255,210,122,0.4)]'
                    : 'border-[var(--line)] bg-[var(--surface)]'
                }`}
              >
                {m} min
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="lamplight rounded-2xl border border-[var(--accent)] bg-[var(--surface-2)] px-5 py-3 text-lg font-semibold text-[var(--accent)] disabled:opacity-50"
          >
            {loading ? 'Writing your story…' : '✨ Create story'}
          </button>
          {loading && (
            <button type="button" onClick={handleStop} className="text-sm text-[var(--muted)]">
              Stop
            </button>
          )}
        </div>
      </form>

      {error && (
        <p className="mt-6 rounded-2xl border border-[var(--accent-2)] bg-[var(--surface)] px-4 py-3 text-[var(--accent-2)]">
          {error}
        </p>
      )}

      {(story || loading) && (
        <article
          aria-live="polite"
          className="mt-6 rounded-3xl border border-[var(--line)] bg-[var(--surface)] px-6 py-6 shadow-[0_16px_50px_-20px_rgba(255,210,122,0.4)]"
        >
          {!loading && story && (
            <div className="mb-4 flex justify-end">
              <NarrationButton text={story} resetKey={String(genId)} />
            </div>
          )}
          {loading && !story && <p className="text-[var(--muted)]">Once upon a time…</p>}
          <StoryBody body={story} />
          {loading && story && (
            <span className="text-[var(--accent)]" aria-hidden="true">
              ▍
            </span>
          )}
          {!loading && story && (
            <p className="mt-6 border-t border-[var(--line)] pt-4 text-center text-sm text-[var(--muted)]">
              🌙 The end. Sweet dreams.
            </p>
          )}
        </article>
      )}
    </div>
  )
}
