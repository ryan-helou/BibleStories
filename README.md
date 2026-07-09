# Bedtime Bible Stories

*A calm reading website where a parent picks a child's age band and reads one chronological Bible story aloud at bedtime.*

The library walks in order through the Protestant Bible (66 books), grouped into nine eras — Creation, Patriarchs, Exodus, Judges, Kings, Exile, Return, Life of Jesus, and Early Church — so that over many nights a family reads Scripture as one connected story. Parents are the users; kids listen, often falling asleep. Every choice serves reading aloud in a dim room: large serif type, a warm cream-or-dusk palette, minimal taps, no animation. Each story ends, quietly, with "Good night."

The interesting part is where the stories come from. They are not generated at runtime. Each one is drafted by Claude Code during a build-time authoring session, reviewed by a human against a short checklist — biblically faithful, age-appropriate, reads well aloud, no invented events — and then committed as a plain TypeScript file. So the shipped site carries no LLM, no API key, and no database: it serves stored text, loads instantly, and every word was read before it went live. Cross-references are real, checkable verses rather than plausible-sounding inventions.

## Age bands and structure

Every story is authored three times, for ages 3–5, 6–8, and 9–12, tuned in vocabulary, length, and depth; a parent picks a band (6–8 by default) and can switch it anytime. Each story shares an `order`, `era`, `title`, `sourcePassage` (e.g. *Genesis 6–9*), and a one-line `teaser`, and each age band adds its own `body`, `themes`, `takeaways`, optional `historicalContext`, `crossReferences`, and `pronunciationHints` for tricky names. During the read only the `body` shows, so nothing interrupts the flow; the rest waits in a "Reflect together" section afterward. For the youngest band, context and cross-references are mostly left out.

Progress lives entirely in the browser (`localStorage`): the last story read for "Continue where you left off," a checkmark on each finished story, favorites, and the chosen band. No account, and nothing leaves the device.

## Content and build

Stories are typed modules in `src/content/stories/`, validated by a Zod schema in `src/content/schema.ts`. A story is added by exporting a `Story` from `NNN-title.ts` and listing it in `src/content/library.ts`; `validateLibrary` refuses to build unless `order` values are unique and gapless from 1. The site is a statically generated Next.js 16 app (React 19, Tailwind v4, Vitest for the content and component tests), prerendering the era-grouped home page and one page per `/story/[order]`, deployed on Vercel.

This is an MVP: three stories so far — Creation, Noah and the Flood, and the Birth of Jesus — enough to prove the whole reading experience and settle the writing style before the library grows. A later phase adds an optional live "generate a story" mode and, eventually, text-to-speech narration.
