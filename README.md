# 🌙 Bedtime Bible Stories

A calm, bedtime-friendly website where a **parent** reads Bible stories aloud to their
kids. Parents are the users; kids listen (often falling asleep). Every choice favors
reading aloud in a dim room: a warm, low-glare night theme, large serif type, and minimal
taps.

There are **two ways to use it**:

1. **📖 A pre-authored library** — a chronological walk through the **Protestant canon**.
   Each story is hand-authored at three age bands (**3–5**, **6–8**, **9–12**), each tuned
   in vocabulary, length, and depth, and each carrying themes, takeaways, historical
   context, cross-references, and pronunciation hints. Read-aloud progress (last story,
   completed stories, favorites, chosen age band) lives in the browser (`localStorage`).
2. **✨ An AI custom-story generator** (`/create`) — the parent enters the **child's age**,
   a **description** of the story or lesson they want, and the **desired minutes**, and a
   fresh bedtime story is written live, streaming word by word, with a few takeaways and an
   accurate verse for tonight.

Both paths support **read-aloud narration** using the browser's built-in speech synthesis,
with adjustable voice, speed, and a sleep timer.

## 🛠️ Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # run the test suite (Vitest)
npm run build    # production build
```

## 🔑 Environment

The AI features call the **Anthropic API**, so they need a key:

```bash
cp .env.local.example .env.local
# then set ANTHROPIC_API_KEY=sk-ant-...   (get one at console.anthropic.com)
```

The static **library** and the **read-aloud reader** work fine **without** a key. Only
`/create` (story generation) and the accompanying verse lookup require `ANTHROPIC_API_KEY`.

## 🏗️ Architecture

- **Next.js 16** (App Router) on **React 19**. The marketing landing page and the library /
  reader pages are statically generated (SSG); each `/story/[order]` page is prerendered.
- **Tailwind CSS v4** for the bedtime theme.
- **Zod-validated content** — every library story is a typed module in
  `src/content/stories/`, validated against `src/content/schema.ts` at build time and in
  tests.
- **A runtime LLM.** Two API routes call Anthropic via `@anthropic-ai/sdk`:
  - `POST /api/generate` — writes the story. Uses **Claude Haiku** (the cheap, fast model,
    ~a penny or less per story) and **streams** the text back as it's written.
    (System/user prompts live in `src/lib/storyPrompt.ts`; input is validated by
    `CustomStoryRequestSchema` in `src/lib/customStory.ts`.)
  - `POST /api/verse` — after the story finishes, asks **Claude Sonnet** (better at pinning
    the verse to the story's actual passage) for one short, real verse with an accurate
    reference.
- **`localStorage`** holds reading progress and age band (`src/lib/progress.ts`,
  `useProgress`, `useAgeBand`) plus narration preferences — voice, rate, and sleep-timer
  minutes (`src/lib/useNarration.ts`). No database, no login.

> Note: earlier versions of this README described the app as having "no runtime LLM." That
> is no longer true — the `/create` generator and the verse lookup both call the Anthropic
> API at runtime.

## 📚 Content — adding a library story

1. Create `src/content/stories/NNN-title.ts` exporting `const story: Story` (shape defined
   by `StorySchema`: `order`, `era`, `title`, `sourcePassage`, `teaser`, and a `bands`
   object with `3-5` / `6-8` / `9-12` content).
2. Add it to the `RAW` array in `src/content/library.ts`.
3. `order` values must be **unique and gapless** starting at 1 — `validateLibrary` enforces
   this at build time, and `tests/content/stories.test.ts` checks the library.

Authoring style: read-aloud rhythm, calm bedtime tone, Protestant framing, faithful to the
source passage (no invented events), each `body` ending on a gentle, comforting note.

## 🗂️ Project layout

```
src/content/    Zod schema, age bands, eras, stories/, library loader
src/lib/        customStory (validation + parsing), storyPrompt (LLM prompts),
                progress + narration state, React hooks (useProgress, useAgeBand, useNarration)
src/components/ AgeBandPicker, EraSection, StoryCard, StoryBody, PronunciationHints,
                ReflectTogether, NarrationButton, NightSkyHero, StoryMaker (the /create UI), icons
src/app/        layout + bedtime theme, landing page, /library, /create, /story/[order],
                api/generate, api/verse
tests/          content, lib, and component tests + smoke test (Vitest + Testing Library)
```

## 🚀 Deploy

Deploy to Vercel (personal scope):

```bash
vercel --scope jameshelou-1395s-projects
```

Set `ANTHROPIC_API_KEY` in the Vercel project's environment variables, or the AI routes
will return a 500. **Before a public launch**, add **rate-limiting** to the public
`/api/generate` and `/api/verse` endpoints and set an **Anthropic spend cap** — both routes
call a paid API and are currently unauthenticated.

## 🧭 Roadmap

- **Favorites view** — favorites are already tracked in `localStorage`; surface them as a
  dedicated list in the library.
- **Saved-story persistence** — let parents keep and revisit generated custom stories
  (currently a generated story lives only in the session).
- **Sleep timer** — already implemented in narration (`useNarration`); polish and expose
  more prominently in the reader.
