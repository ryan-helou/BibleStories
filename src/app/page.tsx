import Link from 'next/link'
import { NightSkyHero } from '@/components/NightSkyHero'

const STEPS = [
  {
    icon: '🎂',
    title: 'Tell us the age',
    body: "Enter your child's exact age. We tune the words, tone, and detail to fit them.",
  },
  {
    icon: '✍️',
    title: 'Describe the story',
    body: 'Ask for any Bible story — and what to focus on, like Daniel’s courage or Ruth’s kindness.',
  },
  {
    icon: '⏱️',
    title: 'Choose the length',
    body: 'Pick how many minutes. We write it as you watch — then read it aloud if you like.',
  },
]

const FEATURES = [
  {
    icon: '🕊️',
    title: 'Faithful & gentle',
    body: 'Warm, non-denominational retellings that stay true to Scripture.',
  },
  {
    icon: '🎯',
    title: 'Any story, any focus',
    body: 'Zacchaeus and kindness, David and courage — you decide the heart of it.',
  },
  {
    icon: '🧒',
    title: 'Just right for their age',
    body: 'The same story, told one way for a 4-year-old and another for a 10-year-old.',
  },
  {
    icon: '⏱️',
    title: 'You choose the length',
    body: 'A one-minute wind-down or a longer bedtime tale — measured in minutes, not pages.',
  },
  {
    icon: '🔊',
    title: 'Read aloud to you',
    body: 'Press play and a calm voice narrates the story while you cuddle up.',
  },
  {
    icon: '📖',
    title: 'A whole-Bible library',
    body: 'Browse classic stories in order and collect a gold star for each one you read.',
  },
]

export default function LandingPage() {
  return (
    <main>
      {/* Hero */}
      <section className="rise mb-12">
        <NightSkyHero height="tall">
          <h1 className="max-w-md text-3xl font-semibold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)] sm:text-4xl">
            A bedtime Bible story, made just for your child
          </h1>
          <p className="mt-2 max-w-sm text-[var(--ink)]/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
            Tell us the age, the story, and the length. We write it — and read it aloud.
          </p>
        </NightSkyHero>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/create"
            className="lantern flex-1 rounded-2xl border border-[var(--accent)] bg-gradient-to-b from-[var(--surface-2)] to-[var(--surface)] px-6 py-4 text-center text-lg font-semibold text-[var(--accent)]"
          >
            ✨ Make a story tonight
          </Link>
          <Link
            href="/library"
            className="lamplight flex-1 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-6 py-4 text-center text-lg font-semibold"
          >
            📖 Browse the library
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="mb-12">
        <p className="mb-1 text-center text-sm font-semibold uppercase tracking-wide text-[var(--accent-2)]">
          How it works
        </p>
        <h2 className="mb-6 text-center text-2xl font-semibold">
          Three little steps to tonight&apos;s story
        </h2>
        <ol className="flex flex-col gap-4">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className="flex items-start gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4"
            >
              <span
                className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--surface-2)] text-xl"
                aria-hidden="true"
              >
                {s.icon}
              </span>
              <div>
                <h3 className="font-semibold">
                  <span className="mr-1.5 text-[var(--accent)]">{i + 1}.</span>
                  {s.title}
                </h3>
                <p className="mt-0.5 text-sm text-[var(--muted)]">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Features */}
      <section className="mb-12">
        <h2 className="mb-6 text-center text-2xl font-semibold">Everything for a cozy bedtime</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="lamplight rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4"
            >
              <div className="mb-2 text-2xl" aria-hidden="true">
                {f.icon}
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-0.5 text-sm text-[var(--muted)]">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mb-6 rounded-3xl border border-[var(--accent)] bg-gradient-to-b from-[var(--surface-2)] to-[var(--surface)] px-6 py-8 text-center">
        <div className="mb-2 text-3xl" aria-hidden="true">
          🌙
        </div>
        <h2 className="text-2xl font-semibold">Tuck them in with a story tonight</h2>
        <p className="mx-auto mt-1 max-w-sm text-[var(--muted)]">
          It takes about thirty seconds to make one, and it&apos;s ready before the lights go out.
        </p>
        <Link
          href="/create"
          className="lantern mt-5 inline-block rounded-2xl border border-[var(--accent)] bg-[var(--surface-2)] px-6 py-3 text-lg font-semibold text-[var(--accent)]"
        >
          ✨ Make a story
        </Link>
      </section>

      <p className="pb-4 text-center text-xs text-[var(--muted)]">
        Gentle, faithful retellings for children · read aloud at bedtime
      </p>
    </main>
  )
}
