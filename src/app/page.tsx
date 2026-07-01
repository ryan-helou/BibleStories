'use client'
import Link from 'next/link'
import { getAllStories } from '@/content/library'
import { ERAS } from '@/content/eras'
import { EraSection } from '@/components/EraSection'
import { AgeBandPicker } from '@/components/AgeBandPicker'
import { useAgeBand } from '@/lib/useAgeBand'
import { useProgress } from '@/lib/useProgress'

export default function HomePage() {
  const stories = getAllStories()
  const { ageBand, setAgeBand } = useAgeBand()
  const { progress } = useProgress()
  const readSet = new Set(progress.read)
  const last = progress.lastRead

  return (
    <main>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Bedtime Bible Stories</h1>
        <p className="text-[var(--muted)]">Read aloud, one story at a time, through the whole Bible.</p>
      </header>

      <div className="mb-6">
        <p className="mb-2 text-sm font-semibold">Who are we reading to tonight?</p>
        <AgeBandPicker value={ageBand} onChange={setAgeBand} />
      </div>

      {last != null && (
        <Link
          href={`/story/${last}`}
          className="mb-6 block rounded-xl border border-[var(--accent)] px-4 py-3 font-semibold"
        >
          Continue where you left off →
        </Link>
      )}

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
