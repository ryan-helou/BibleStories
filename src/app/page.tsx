import Link from 'next/link'
import { NightSkyHero } from '@/components/NightSkyHero'
import { StoryMaker } from '@/components/StoryMaker'

const FEATURES = [
  { icon: '🔊', label: 'Read aloud' },
  { icon: '🎯', label: 'Any story or focus' },
  { icon: '🧒', label: 'Tuned to their age' },
  { icon: '⏱️', label: 'Any length' },
  { icon: '🕊️', label: 'Gentle & faithful' },
  { icon: '📖', label: 'Whole-Bible library' },
]

export default function LandingPage() {
  return (
    <main>
      <section className="rise mb-6">
        <NightSkyHero height="short">
          <h1 className="text-2xl font-semibold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)] sm:text-3xl">
            A bedtime Bible story, made for your child
          </h1>
          <p className="mt-1 max-w-sm text-sm text-[var(--ink)]/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
            Tell us the age, the story, and the length — we&apos;ll write it and read it aloud.
          </p>
        </NightSkyHero>
      </section>

      {/* Show it first: the maker is right here, no scrolling to find it. */}
      <section className="mb-8">
        <StoryMaker />
      </section>

      {/* Compact feature strip instead of stacked cards. */}
      <section className="mb-8 border-t border-[var(--line)] pt-6">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
          {FEATURES.map((f) => (
            <li key={f.label} className="flex items-center gap-2">
              <span aria-hidden="true" className="text-lg">
                {f.icon}
              </span>
              <span className="text-[var(--muted)]">{f.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <Link
        href="/library"
        className="lamplight mb-4 flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-5 py-4 font-semibold"
      >
        <span>
          <span aria-hidden="true" className="mr-2">
            📖
          </span>
          Or browse the whole-Bible library
        </span>
        <span aria-hidden="true" className="text-[var(--accent)]">
          →
        </span>
      </Link>
    </main>
  )
}
