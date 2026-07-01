import Link from 'next/link'
import { NightSkyHero } from '@/components/NightSkyHero'
import { StoryMaker } from '@/components/StoryMaker'

export default function CreatePage() {
  return (
    <main className="mx-auto max-w-2xl">
      <div className="mb-4 text-sm">
        <Link href="/library" className="font-semibold text-[var(--accent)] hover:text-[var(--ink)]">
          ← Library
        </Link>
      </div>

      <header className="rise mb-7">
        <NightSkyHero height="short">
          <span className="eyebrow mb-2 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
            Just for tonight
          </span>
          <h1 className="text-2xl font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
            Make a story <span className="gradient-text">just for tonight</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--ink)]/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
            The age, the story, the length — we&apos;ll write it as you watch.
          </p>
        </NightSkyHero>
      </header>

      <div className="rise-2">
        <StoryMaker />
      </div>
    </main>
  )
}
