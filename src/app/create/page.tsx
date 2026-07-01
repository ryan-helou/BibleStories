import Link from 'next/link'
import { NightSkyHero } from '@/components/NightSkyHero'
import { StoryMaker } from '@/components/StoryMaker'

export default function CreatePage() {
  return (
    <main>
      <div className="mb-4 text-sm">
        <Link href="/library" className="text-[var(--accent)]">
          ← Library
        </Link>
      </div>

      <header className="mb-7">
        <NightSkyHero height="short">
          <h1 className="text-2xl font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            Make a story just for tonight
          </h1>
          <p className="mt-0.5 text-sm text-[var(--ink)]/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
            The age, the story, the length — we&apos;ll write it as you watch.
          </p>
        </NightSkyHero>
      </header>

      <StoryMaker />
    </main>
  )
}
