import Link from 'next/link'
import { NightSkyHero } from '@/components/NightSkyHero'
import { StoryBody } from '@/components/StoryBody'
import { AGE_BANDS } from '@/content/ageBands'

const STEPS = [
  {
    n: '1',
    icon: '✍️',
    title: 'Tell us three things',
    body: 'Your child’s age, the story or lesson you want, and how many minutes you have.',
  },
  {
    n: '2',
    icon: '🌙',
    title: 'We write it live',
    body: 'A gentle, age-tuned Bible story appears word by word — with things to remember and a verse for tonight.',
  },
  {
    n: '3',
    icon: '🔊',
    title: 'Read it together',
    body: 'Read it yourself, or tap once and let a calm voice read it aloud while you cuddle up.',
  },
]

const FEATURES = [
  { icon: '🎯', title: 'Any story or focus', body: 'Daniel’s courage, Esther’s bravery, Jonah’s second chance — you pick the lesson.' },
  { icon: '🧒', title: 'Tuned to their age', body: 'Written just right for ages 3–5, 6–8, or 9–12 — never too scary, never too dull.' },
  { icon: '⏱️', title: 'Any length', body: 'One quiet minute on a hard night, or a twelve-minute bedtime epic.' },
  { icon: '🕊️', title: 'Gentle & faithful', body: 'Warm, comforting, and true to Scripture — with an accurate verse every time.' },
  { icon: '🔊', title: 'Read aloud', body: 'A soft narration voice reads any story, so your hands are free to tuck in.' },
  { icon: '📖', title: 'Whole-Bible library', body: 'Prefer a classic? Every story, in order, ready to read tonight.' },
]

const SAMPLE_STORY = `In the very beginning, before there was anything at all, there was God. There was no earth and no sky, no sun to warm the day and no moon to light the night. But God was there, and God had a wonderful plan.

On the first day, God spoke into the darkness. "Let there be light," he said. And just like that, light appeared and pushed the darkness back.`

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="hr-star mb-6 text-xs font-semibold uppercase tracking-[0.16em]">
      <span aria-hidden="true">✦</span> {children}
    </div>
  )
}

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-5xl">
      {/* ── Hero: text + CTAs beside the night-sky art on desktop ─── */}
      <section className="rise mb-14 grid items-center gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="order-2 lg:order-1">
          <span className="eyebrow mb-3">Bedtime, made sacred</span>
          <h1 className="text-4xl font-semibold leading-[1.05] sm:text-5xl">
            A bedtime Bible story, <span className="gradient-text">made for your child</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-[var(--muted)] sm:text-lg">
            Tell us the age, the story, and the length — we’ll write it, and read it aloud, tonight.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/create" className="btn btn-primary btn-lg lantern">
              ✨ Create your own story
            </Link>
            <Link href="/library" className="btn btn-soft btn-lg">
              📖 Choose from the library
            </Link>
          </div>
          <p className="mt-4 text-sm text-[var(--faint)]">
            Free to try · No sign-up · Under a penny a story
          </p>
        </div>
        <div className="order-1 lg:order-2">
          <NightSkyHero height="tall" />
        </div>
      </section>

      {/* ── What it is: copy + a live storybook-page preview ──────── */}
      <section className="mb-14">
        <SectionLabel>What it is</SectionLabel>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">
              Every child deserves a story that’s <span className="gradient-text">just for them</span>
            </h2>
            <p className="mt-4 text-[var(--muted)]">
              Not another generic picture book. You choose the child, the passage, and the moment —
              and out comes a warm, faithful bedtime story written for exactly who’s listening. Then
              it reads itself aloud, so the last thing they hear before sleep is grace.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/create" className="btn btn-primary">
                ✨ Try it now
              </Link>
              <Link href="/library" className="btn btn-ghost">
                Browse the library →
              </Link>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--line-soft)] bg-[var(--surface-2)]/40 px-6 py-3">
              <span className="eyebrow">A peek at tonight’s story</span>
              <span className="badge">Ages 6–8</span>
            </div>
            <div className="px-6 py-6 sm:px-7">
              <div className="prose-story">
                <StoryBody body={SAMPLE_STORY} dropcap />
              </div>
              <div className="hr-star mt-2 text-sm">
                <span aria-hidden="true">🌙</span> …and it continues, just for them.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section className="mb-14">
        <SectionLabel>How it works</SectionLabel>
        <ol className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="card p-5">
              <span
                aria-hidden="true"
                className="mb-3 grid h-11 w-11 place-items-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-xl"
              >
                {s.icon}
              </span>
              <span className="badge mb-2">Step {s.n}</span>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Two paths ────────────────────────────────────────────── */}
      <section className="mb-14">
        <SectionLabel>Two ways to begin</SectionLabel>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card-glass flex flex-col p-6 sm:p-7">
            <span
              aria-hidden="true"
              className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[var(--accent)]/15 text-2xl"
            >
              ✨
            </span>
            <h3 className="text-xl font-semibold text-[var(--accent)]">Create your own</h3>
            <p className="mt-2 flex-1 text-sm text-[var(--muted)]">
              Tell us the age, the story, and the length. We’ll write a brand-new bedtime story,
              live, just for tonight — with takeaways and a verse.
            </p>
            <Link href="/create" className="btn btn-primary mt-6 w-full">
              ✨ Make a story
            </Link>
          </div>

          <div className="card-glass flex flex-col p-6 sm:p-7">
            <span
              aria-hidden="true"
              className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[var(--accent-3)]/20 text-2xl"
            >
              📖
            </span>
            <h3 className="text-xl font-semibold text-[var(--accent)]">Choose from the library</h3>
            <p className="mt-2 flex-1 text-sm text-[var(--muted)]">
              Prefer a classic? Browse the whole Bible in order — each story told gently, with
              age bands, narration, and questions to talk about.
            </p>
            <Link href="/library" className="btn btn-soft mt-6 w-full">
              📖 Open the library
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="mb-14">
        <SectionLabel>Made for bedtime</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-5">
              <span aria-hidden="true" className="text-2xl leading-none">
                {f.icon}
              </span>
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Age bands ────────────────────────────────────────────── */}
      <section className="mb-14">
        <SectionLabel>Grows with your child</SectionLabel>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">
              The same truth, told for <span className="gradient-text">their age</span>
            </h2>
            <p className="mt-4 text-[var(--muted)]">
              A three-year-old and a ten-year-old don’t need the same words. Every story comes in
              three gentle voices, so it always lands just right.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {AGE_BANDS.map((b) => (
              <div key={b.key} className="card p-4">
                <span className="block font-semibold text-[var(--accent)]">{b.label}</span>
                <span className="mt-1 block text-sm text-[var(--muted)]">{b.blurb}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reassurance verse ────────────────────────────────────── */}
      <section className="mb-14">
        <div className="callout mx-auto max-w-3xl">
          <p className="text-sm font-semibold text-[var(--accent-2)]">
            <span aria-hidden="true">📖</span> Why we made this
          </p>
          <p className="prose-story mt-2 text-xl italic leading-relaxed sm:text-2xl">
            “Teach them diligently to your children… when you lie down, and when you rise.”
          </p>
          <p className="mt-1.5 text-sm font-semibold text-[var(--muted)]">— Deuteronomy 6:7</p>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Bedtime is one of the few quiet moments a family shares every day. We wanted to make it
            easy to fill that moment with a story that’s gentle, faithful, and made with love.
          </p>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────── */}
      <section className="mb-6">
        <div className="lantern rounded-3xl border border-[rgba(255,210,122,0.55)] bg-gradient-to-b from-[var(--surface-3)] to-[var(--surface)] px-6 py-10 text-center sm:py-12">
          <span aria-hidden="true" className="text-3xl">
            🌙
          </span>
          <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
            Ready for a <span className="gradient-text">better bedtime</span>?
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-[var(--muted)]">
            Write one tonight, or pick a favorite from the library. It only takes a moment.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/create" className="btn btn-primary btn-lg">
              ✨ Create your own story
            </Link>
            <Link href="/library" className="btn btn-soft btn-lg">
              📖 Browse the library
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
