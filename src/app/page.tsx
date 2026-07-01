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

const STEPS = [
  { n: '1', title: 'Tell us three things', body: 'Their age, the story, and how long.' },
  { n: '2', title: 'We write it live', body: 'A gentle, age-tuned story appears as you watch.' },
  { n: '3', title: 'Read it together', body: 'Tap to have it read aloud at bedtime.' },
]

export default function LandingPage() {
  return (
    <main>
      <section className="rise mb-6">
        <NightSkyHero height="short">
          <span className="eyebrow mb-2 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
            Bedtime, made sacred
          </span>
          <h1 className="text-2xl font-semibold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] sm:text-3xl">
            A bedtime Bible story, <span className="gradient-text">made for your child</span>
          </h1>
          <p className="mt-1.5 max-w-sm text-sm text-[var(--ink)]/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
            Tell us the age, the story, and the length — we&apos;ll write it and read it aloud.
          </p>
        </NightSkyHero>
      </section>

      {/* Show it first: the maker is right here, no scrolling to find it. */}
      <section className="rise-2 mb-9">
        <StoryMaker />
      </section>

      {/* How it works — three calm steps. */}
      <section className="rise-3 mb-9">
        <div className="hr-star mb-5 text-xs font-semibold uppercase tracking-[0.16em]">
          <span aria-hidden="true">✦</span> How it works
        </div>
        <ol className="grid gap-3 sm:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="card p-4">
              <span className="badge mb-2">Step {s.n}</span>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-0.5 text-sm text-[var(--muted)]">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Feature chips. */}
      <section className="mb-9">
        <ul className="flex flex-wrap gap-2.5">
          {FEATURES.map((f) => (
            <li key={f.label} className="chip">
              <span aria-hidden="true" className="chip-icon">
                {f.icon}
              </span>
              <span>{f.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <Link
        href="/library"
        className="card lift mb-4 flex items-center justify-between gap-4 px-5 py-4"
      >
        <span className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid h-11 w-11 flex-none place-items-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-xl"
          >
            📖
          </span>
          <span>
            <span className="block font-semibold">Browse the whole-Bible library</span>
            <span className="block text-sm text-[var(--muted)]">
              Every story, in order, told gently by age.
            </span>
          </span>
        </span>
        <span aria-hidden="true" className="text-lg text-[var(--accent)]">
          →
        </span>
      </Link>
    </main>
  )
}
