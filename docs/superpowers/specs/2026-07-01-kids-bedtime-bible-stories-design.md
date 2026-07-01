# Kids' Bedtime Bible Stories — Design

**Date:** 2026-07-01
**Status:** Approved (design), pending implementation plan
**Repo:** ryan-helou/BibleStories

## 1. Product Overview

A calm, bedtime-friendly **website** where a **parent** selects their child's age band and reads a Bible story aloud. The library walks **chronologically through the whole Protestant Bible** (66 books), so over many nights a family experiences Scripture as one connected story.

**Users vs. listeners:** Parents are the users — they read aloud. Kids listen (often falling asleep). Every design choice favors *reading aloud in a dim room at bedtime*: large legible type, warm low-glare palette, minimal taps, no jarring interactions or animations, natural spoken rhythm in the prose.

**Non-goals (MVP):** no kid-facing interactivity, no login, no live AI generation, no audio narration. Those are later phases.

## 2. Story Source Model (settled)

Stories are **pre-generated into a version-controlled library**; the shipped site is read-only and serves stored text. Kids/parents cannot generate stories in the MVP.

- **The generator is Claude Code at build-time.** During development sessions, a "story generator" module drafts each story into the content schema; author + user review before commit.
- The shipped MVP has **no LLM, no API keys, no per-read cost, and instant loads.**
- **Hybrid future:** Phase 2 reuses the same generator module at runtime for an optional live "generate a story" feature behind a flag, rolled out via A/B testing. Same content shape lands in the same library.

**Why:** one-time authoring cost (a few cents per story version) vs. recurring, unbounded per-read cost; full accuracy review before publishing; bedtime-fast static delivery.

## 3. Architecture (MVP)

- **Next.js on Vercel**, statically generated (SSG). Matches existing stack; free-tier friendly.
- **Content as files in the repo** — one file per story containing all three age-band versions. **No database** in the MVP (read-only library + no logins ⇒ none needed).
- **Build-time authoring pipeline** — a clean story-generator module with interface `(passage, ageBand) → structured story`, driven by Claude Code during sessions. Reused at runtime in Phase 2.
- **Progress in the browser** via `localStorage`: last story read, completed stories, favorites, chosen age band. No personal data leaves the device; progress does not sync across devices (acceptable for MVP).

### Phased scope
- **Phase 1 (MVP):** reading website + starter library + build-time authoring pipeline + localStorage progress.
- **Phase 2:** optional live "generate a story" feature behind a flag, with A/B testing (introduces API key + database to store generated stories).
- **Phase 3:** optional TTS voice narration.

## 4. Content Model

Age bands: **3–5, 6–8, 9–12** (boundaries adjustable).
Tradition: **Protestant, 66 books.** Ordering: **chronological.**

### Shared across all ages (story-level)
- `order` — position in the chronological walk (unique, gapless).
- `era` — navigation "act": *Creation, Patriarchs, Exodus, Judges, Kings, Exile, Return, Life of Jesus, Early Church*.
- `title` — e.g., "Noah and the Flood".
- `sourcePassage` — Scripture reference, e.g., *Genesis 6–9*.
- `teaser` — one calm sentence for the library list.

### Adapted per age band (×3)
- `body` — read-aloud story text, tuned in vocabulary, length, and detail for the band.
- `themes` — key themes highlighted (e.g., *obedience, God's faithfulness*).
- `takeaways` — "what we learn" points; fewer & simpler for young, more & deeper for older.
- `historicalContext` — short note **when it genuinely helps**; mostly older bands, usually omitted for 3–5.
- `crossReferences` — related verses, each with a one-line "why it connects" note; light for young, richer for older.
- `pronunciationHints` — optional read-aloud help for tricky names (e.g., *Nebuchadnezzar → neb-uh-kad-NEZ-er*).

**Presentation rule:** during the read, only `body` shows so the bedtime flow is uninterrupted. Everything else appears in a quiet "Reflect together" section *after* the story. For the youngest band, `historicalContext` and `crossReferences` are minimal or hidden.

## 5. Reading Experience

**Home / library**
- First visit: gentle prompt to pick the child's age band (remembered, changeable anytime).
- Library shows the **chronological journey grouped by era**, with **"Continue where you left off"** and simple read-checkmarks showing progress through the whole Bible.

**Story view (bedtime-first)**
- Distraction-free: title, Scripture reference, then the **large, readable `body`** in a warm low-glare theme (soft cream or deep-dusk palette, large serif type, generous spacing). Nothing interrupts the read.
- **After the story:** a quiet "Reflect together" section holds `themes`, `takeaways`, `historicalContext`, `crossReferences`.
- **Prev / Next** move through the Bible in order. **Favorite** and **mark-as-read** (auto-marked at the end). **Pronunciation-hints** peek available inline so a hard name doesn't catch a parent off guard mid-read.

**Aesthetic:** calm, warm, reverent, bedtime-appropriate — not a flashy cartoon app. Big type readable in a dim room; minimal taps; no harsh whites or animations.

## 6. Authoring Pipeline, Accuracy & Testing

**Authoring (build-time)**
- Story generator module: `(passage, ageBand) → structured story`. Claude Code drafts; author + user review before commit.
- Consistent style guide: read-aloud rhythm, band-appropriate vocabulary, calm bedtime tone, Protestant framing, faithful to the source text.
- **Accuracy safeguards:** every story cites its `sourcePassage`; cross-references are real, checkable verses; a pre-publish review checklist — *biblically faithful? age-appropriate? reads well aloud? no invented events?* Content is in git, so every change is reviewable and reversible.

**Testing**
- **Content validation tests:** every story file matches the schema (all three bands present, required fields filled, `order` unique and gapless, `sourcePassage` and cross-references well-formed).
- **Component tests:** reading view renders; age-band switch swaps content; progress saves/loads from localStorage; prev/next navigation correct.
- **Build check:** static site builds cleanly with the full library.

## 7. Phase 1 Starter Scope

Ship the full app plus **~3 stories, each authored at all three age bands** (≈9 story versions). Deliberately minimal — enough to prove the end-to-end experience and **tune the writing style** before investing in a larger library. Grow the library over subsequent sessions.

Suggested first three (spanning eras, adjustable): **Creation**, **Noah and the Flood**, and one from the **Life of Jesus** (e.g., *The Birth of Jesus*).
