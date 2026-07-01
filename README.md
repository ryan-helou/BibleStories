# Bedtime Bible Stories

A calm, bedtime-friendly website where a **parent** picks their child's age band and
reads a Bible story aloud. The library walks **chronologically through the whole
Protestant Bible (66 books)**, so over many nights a family experiences Scripture as one
connected story.

Parents are the users; kids listen (often falling asleep). Every choice favors reading
aloud in a dim room: warm low-glare theme, large serif type, minimal taps.

Stories are **pre-authored content** — there is no runtime LLM, no database, and no login
in this MVP. Age band and reading progress are stored in the browser (`localStorage`).

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # run the test suite (Vitest)
npm run build    # static production build
```

## How it works

- **Age bands** — `3–5`, `6–8`, `9–12`. Each story is authored at all three, tuned in
  vocabulary, length, and depth. Parents can switch bands anytime; the choice is remembered.
- **Content model** — every story has a shared part (`order`, `era`, `title`,
  `sourcePassage`, `teaser`) and a per-band part (`body`, `themes`, `takeaways`, optional
  `historicalContext`, `crossReferences`, `pronunciationHints`). During the read only the
  `body` shows; the rest appears in a quiet "Reflect together" section afterward.
- **Reading length** — one telling per band, sized for a fuller bedtime read
  (roughly 3–7 minutes read aloud, scaling up with age).
- **Progress** — last story read ("Continue where you left off"), completed stories
  (✓ in the library), favorites, and the chosen age band, all in `localStorage`.
- **Rendering** — statically generated (SSG). The home page lists stories grouped by era;
  each `/story/[order]` page is prerendered.

## Content

Stories live in `src/content/stories/` as typed modules validated by
`src/content/schema.ts` (Zod). To add a story:

1. Create `src/content/stories/NNN-title.ts` exporting `const story: Story`.
2. Add it to the `RAW` array in `src/content/library.ts`.
3. `order` values must be unique and gapless starting at 1 — `validateLibrary` enforces
   this at build time, and `tests/content/stories.test.ts` checks the library.

Authoring style: read-aloud rhythm, calm bedtime tone, Protestant framing, faithful to the
source passage (no invented events), each `body` ending with a gentle "Good night."

## Project layout

```
src/content/    schema (Zod), age bands, eras, stories, library loader
src/lib/        localStorage progress layer + React hooks
src/components/ AgeBandPicker, StoryCard, EraSection, StoryBody,
                PronunciationHints, ReflectTogether
src/app/        layout + bedtime theme, home page, story/[order] route
tests/          content, lib, and component tests (Vitest + Testing Library)
```

## Deploy

Static site — deploy to Vercel (personal scope):

```bash
vercel --scope jameshelou-1395s-projects
```

## Roadmap

- **Phase 2:** optional live "generate a story" feature behind a flag, with A/B testing
  (adds an API key + a database to store generated stories).
- **Phase 3:** optional text-to-speech voice narration.
