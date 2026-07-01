'use client'
import Link from 'next/link'
import { getAllStories } from '@/content/library'
import { ERAS } from '@/content/eras'
import { EraSection } from '@/components/EraSection'
import { AgeBandPicker } from '@/components/AgeBandPicker'
import { useAgeBand } from '@/lib/useAgeBand'
import { useProgress } from '@/lib/useProgress'

export default function LibraryPage() {
  const stories = getAllStories()
  const { ageBand, setAgeBand } = useAgeBand()
  const { progress } = useProgress()
  const readSet = new Set(progress.read)
  const last = progress.lastRead

  return (
    <main className="mx-auto max-w-2xl">
      <div className="mb-4 text-sm">
        <Link href="/" className="font-semibold text-[var(--accent)] hover:text-[var(--ink)]">
          ← Home
        </Link>
      </div>

      <header className="rise mb-7">
        <span className="eyebrow mb-2">The whole Bible</span>
        <h1 className="text-3xl font-semibold">
          The story <span className="gradient-text">library</span>
        </h1>
        <p className="mt-1.5 text-[var(--muted)]">
          The whole Bible, in order, told gently for your child.
        </p>
      </header>

      <Link
        href="/create"
        className="lantern rise-2 mb-9 flex items-center gap-4 rounded-3xl border border-[rgba(255,210,122,0.55)] bg-gradient-to-b from-[var(--surface-3)] to-[var(--surface)] px-6 py-5"
      >
        <span
          aria-hidden="true"
          className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-[var(--accent)]/15 text-2xl"
        >
          ✨
        </span>
        <span className="flex-1">
          <span className="block text-xl font-semibold text-[var(--accent)]">
            Make a story just for tonight
          </span>
          <span className="mt-0.5 block text-sm text-[var(--muted)]">
            Any story, any focus, in the length you choose.
          </span>
        </span>
        <span aria-hidden="true" className="text-lg text-[var(--accent)]">
          →
        </span>
      </Link>

      <div className="mb-9">
        <p className="mb-2 text-sm font-semibold">Who are we reading to tonight?</p>
        <AgeBandPicker value={ageBand} onChange={setAgeBand} />
      </div>

      {last != null && (
        <Link
          href={`/story/${last}`}
          className="card lift mb-9 flex items-center gap-3 px-4 py-3 font-semibold"
        >
          <span aria-hidden="true" className="text-lg">
            📖
          </span>
          Pick up where you left off
          <span aria-hidden="true" className="ml-auto text-[var(--accent)]">
            →
          </span>
        </Link>
      )}

      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">The whole story, in order</h2>
        <span className="badge">
          <span aria-hidden="true">★</span> {readSet.size} read
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
