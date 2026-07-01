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
    <main>
      <div className="mb-4 text-sm">
        <Link href="/" className="text-[var(--accent)]">
          ← Home
        </Link>
      </div>

      <header className="mb-7">
        <h1 className="text-2xl font-semibold">The story library</h1>
        <p className="mt-1 text-[var(--muted)]">
          The whole Bible, in order, told gently for your child.
        </p>
      </header>

      <Link
        href="/create"
        className="lantern mb-9 block rounded-3xl border border-[var(--accent)] bg-gradient-to-b from-[var(--surface-2)] to-[var(--surface)] px-6 py-5 text-center"
      >
        <span className="block text-xl font-semibold text-[var(--accent)]">
          ✨ Make a story just for tonight
        </span>
        <span className="mt-1 block text-sm text-[var(--muted)]">
          Any story, any focus, in the length you choose.
        </span>
      </Link>

      <div className="mb-9">
        <p className="mb-2 text-sm font-semibold">Who are we reading to tonight?</p>
        <AgeBandPicker value={ageBand} onChange={setAgeBand} />
      </div>

      {last != null && (
        <Link
          href={`/story/${last}`}
          className="lamplight mb-9 flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 font-semibold"
        >
          <span aria-hidden="true">📖</span>
          Pick up where you left off
        </Link>
      )}

      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">The whole story, in order</h2>
        <span className="text-sm text-[var(--muted)]">
          <span className="text-[var(--accent)]">{'★'.repeat(Math.min(readSet.size, 3))}</span>
          {'☆'.repeat(Math.max(0, 3 - Math.min(readSet.size, 3)))} {readSet.size} read
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
