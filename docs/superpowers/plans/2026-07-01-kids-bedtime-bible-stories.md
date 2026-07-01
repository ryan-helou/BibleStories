# Kids' Bedtime Bible Stories — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a calm, bedtime-friendly website where a parent picks a child's age band and reads a chronological, Protestant-canon Bible story aloud, starting with a 3-story vertical slice.

**Architecture:** A statically-generated Next.js (App Router) site. Stories are version-controlled TypeScript content files validated by a Zod schema. Age-band selection and reading progress live in the browser (`localStorage`); there is no database, no runtime LLM, and no auth in this MVP. Story data (all three age bands) is embedded at build time via SSG; the client picks which band to render.

**Tech Stack:** Next.js (App Router, TypeScript, React), Tailwind CSS v4, Zod (content schema), Vitest + @testing-library/react + jsdom (tests), deployed on Vercel.

---

## File Structure

```
BibleStories/
  package.json, tsconfig.json, next.config.ts, vitest.config.ts, vitest.setup.ts
  src/
    content/
      schema.ts              # Zod schema + inferred Story types
      ageBands.ts            # AGE_BANDS list + labels
      eras.ts                # ERAS ordered list + labels
      stories/
        001-creation.ts
        002-noah-and-the-flood.ts
        003-the-birth-of-jesus.ts
      library.ts             # loads, validates, sorts all stories; lookup helpers
    lib/
      progress.ts            # pure localStorage read/write for progress + age band
      useProgress.ts         # React hook wrapping progress.ts
      useAgeBand.ts          # React hook wrapping age-band persistence
    components/
      AgeBandPicker.tsx
      StoryCard.tsx
      EraSection.tsx
      StoryBody.tsx
      PronunciationHints.tsx
      ReflectTogether.tsx
    app/
      layout.tsx
      globals.css
      page.tsx               # home / library
      story/[order]/page.tsx # story view (SSG per story)
  tests/
    content/schema.test.ts
    content/library.test.ts
    lib/progress.test.ts
    components/*.test.tsx
```

Boundaries: `content/*` owns data + validation (no React). `lib/*` owns persistence (progress.ts is pure and unit-tested; hooks wrap it for React). `components/*` are presentational. `app/*` wires routing + SSG.

---

## Task 1: Scaffold the Next.js project

**Files:**
- Create: whole project scaffold (via create-next-app), then `vitest.config.ts`, `vitest.setup.ts`, edits to `package.json`.

- [ ] **Step 1: Scaffold Next.js into the existing repo**

Run (from the repo root `~/BibleStories`, which already contains `.git` and `docs/`):
```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir --eslint --import-alias "@/*" --turbopack --use-npm
```
When prompted that the directory is not empty, allow it to proceed (it keeps `.git` and `docs/`). Expected: a Next.js app is created with `src/app/`, `package.json`, `tsconfig.json`.

- [ ] **Step 2: Install test dependencies**

Run:
```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event zod
```
Expected: packages install without error. (`zod` is a runtime dep for the schema; installing here is fine.)

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
})
```

- [ ] **Step 4: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 5: Add test scripts to `package.json`**

In the `"scripts"` block add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 6: Create a smoke test at `tests/smoke.test.ts`**

```ts
import { describe, it, expect } from 'vitest'

describe('smoke', () => {
  it('runs the test suite', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 7: Run the smoke test**

Run: `npm test`
Expected: PASS, 1 test passing.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with Vitest and Tailwind"
```

---

## Task 2: Content schema and types

**Files:**
- Create: `src/content/schema.ts`
- Test: `tests/content/schema.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/content/schema.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { StorySchema } from '@/content/schema'

const validStory = {
  order: 1,
  era: 'Creation',
  title: 'In the Beginning',
  sourcePassage: 'Genesis 1–2',
  teaser: 'God speaks the whole world into being.',
  bands: {
    '3-5': {
      body: 'In the beginning, God made everything.',
      themes: ['God is Creator'],
      takeaways: ['God made the world.'],
      crossReferences: [],
      pronunciationHints: [],
    },
    '6-8': {
      body: 'In the beginning God made the heavens and the earth.',
      themes: ['God is Creator', 'Order from nothing'],
      takeaways: ['God made everything good.'],
      historicalContext: 'Genesis opens the Bible.',
      crossReferences: [{ reference: 'John 1:1', note: 'The Word was there at creation.' }],
      pronunciationHints: [],
    },
    '9-12': {
      body: 'In the beginning, God created the heavens and the earth, and it was very good.',
      themes: ['God is Creator', 'Goodness of creation'],
      takeaways: ['Creation reflects God’s character.'],
      historicalContext: 'Genesis is the first book of the Torah.',
      crossReferences: [{ reference: 'John 1:1', note: 'Jesus present at creation.' }],
      pronunciationHints: [{ name: 'Genesis', pronunciation: 'JEN-uh-sis' }],
    },
  },
}

describe('StorySchema', () => {
  it('accepts a valid story', () => {
    expect(() => StorySchema.parse(validStory)).not.toThrow()
  })

  it('rejects a story missing an age band', () => {
    const bad = { ...validStory, bands: { '3-5': validStory.bands['3-5'] } }
    expect(() => StorySchema.parse(bad)).toThrow()
  })

  it('rejects an unknown era', () => {
    const bad = { ...validStory, era: 'Spaceships' }
    expect(() => StorySchema.parse(bad)).toThrow()
  })

  it('rejects a non-positive order', () => {
    const bad = { ...validStory, order: 0 }
    expect(() => StorySchema.parse(bad)).toThrow()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/content/schema.test.ts`
Expected: FAIL — cannot resolve `@/content/schema`.

- [ ] **Step 3: Write `src/content/schema.ts`**

```ts
import { z } from 'zod'

export const AGE_BAND_KEYS = ['3-5', '6-8', '9-12'] as const
export type AgeBand = (typeof AGE_BAND_KEYS)[number]

export const ERA_KEYS = [
  'Creation',
  'Patriarchs',
  'Exodus',
  'Judges',
  'Kings',
  'Exile',
  'Return',
  'Life of Jesus',
  'Early Church',
] as const
export type Era = (typeof ERA_KEYS)[number]

const CrossReferenceSchema = z.object({
  reference: z.string().min(1),
  note: z.string().min(1),
})

const PronunciationHintSchema = z.object({
  name: z.string().min(1),
  pronunciation: z.string().min(1),
})

const AgeBandContentSchema = z.object({
  body: z.string().min(1),
  themes: z.array(z.string().min(1)).min(1),
  takeaways: z.array(z.string().min(1)).min(1),
  historicalContext: z.string().min(1).optional(),
  crossReferences: z.array(CrossReferenceSchema),
  pronunciationHints: z.array(PronunciationHintSchema),
})

export const StorySchema = z.object({
  order: z.number().int().positive(),
  era: z.enum(ERA_KEYS),
  title: z.string().min(1),
  sourcePassage: z.string().min(1),
  teaser: z.string().min(1),
  bands: z.object({
    '3-5': AgeBandContentSchema,
    '6-8': AgeBandContentSchema,
    '9-12': AgeBandContentSchema,
  }),
})

export type CrossReference = z.infer<typeof CrossReferenceSchema>
export type PronunciationHint = z.infer<typeof PronunciationHintSchema>
export type AgeBandContent = z.infer<typeof AgeBandContentSchema>
export type Story = z.infer<typeof StorySchema>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/content/schema.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add src/content/schema.ts tests/content/schema.test.ts
git commit -m "feat: add Zod content schema and story types"
```

---

## Task 3: Age band and era metadata

**Files:**
- Create: `src/content/ageBands.ts`, `src/content/eras.ts`

- [ ] **Step 1: Write `src/content/ageBands.ts`**

```ts
import { AGE_BAND_KEYS, type AgeBand } from './schema'

export interface AgeBandInfo {
  key: AgeBand
  label: string
  blurb: string
}

export const AGE_BANDS: AgeBandInfo[] = [
  { key: '3-5', label: 'Ages 3–5', blurb: 'Short and gentle, just the heart of the story.' },
  { key: '6-8', label: 'Ages 6–8', blurb: 'A little more detail, with themes to talk about.' },
  { key: '9-12', label: 'Ages 9–12', blurb: 'Fuller story with context and cross-references.' },
]

export const DEFAULT_AGE_BAND: AgeBand = '6-8'

export function isAgeBand(value: string | null): value is AgeBand {
  return value !== null && (AGE_BAND_KEYS as readonly string[]).includes(value)
}
```

- [ ] **Step 2: Write `src/content/eras.ts`**

```ts
import { ERA_KEYS, type Era } from './schema'

// ERA_KEYS is already in chronological order.
export const ERAS: Era[] = [...ERA_KEYS]

export function eraIndex(era: Era): number {
  return ERAS.indexOf(era)
}
```

- [ ] **Step 3: Commit**

```bash
git add src/content/ageBands.ts src/content/eras.ts
git commit -m "feat: add age band and era metadata"
```

---

## Task 4: Library loader (validate, sort, look up)

**Files:**
- Create: `src/content/library.ts`
- Test: `tests/content/library.test.ts`
- Depends on Task 5 stories existing for the "gapless" assertions; write library.ts against the schema now and let Task 5 satisfy the data assertions. For this task, test with an inline fixture array via a testable pure function.

- [ ] **Step 1: Write the failing test**

`tests/content/library.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { validateLibrary, sortByOrder } from '@/content/library'
import type { Story } from '@/content/schema'

function make(order: number): Story {
  return {
    order,
    era: 'Creation',
    title: `Story ${order}`,
    sourcePassage: 'Genesis 1',
    teaser: 'teaser',
    bands: {
      '3-5': { body: 'b', themes: ['t'], takeaways: ['k'], crossReferences: [], pronunciationHints: [] },
      '6-8': { body: 'b', themes: ['t'], takeaways: ['k'], crossReferences: [], pronunciationHints: [] },
      '9-12': { body: 'b', themes: ['t'], takeaways: ['k'], crossReferences: [], pronunciationHints: [] },
    },
  }
}

describe('sortByOrder', () => {
  it('sorts ascending by order', () => {
    expect(sortByOrder([make(3), make(1), make(2)]).map((s) => s.order)).toEqual([1, 2, 3])
  })
})

describe('validateLibrary', () => {
  it('passes for gapless unique orders starting at 1', () => {
    expect(() => validateLibrary([make(1), make(2), make(3)])).not.toThrow()
  })

  it('throws on a duplicate order', () => {
    expect(() => validateLibrary([make(1), make(1)])).toThrow(/duplicate/i)
  })

  it('throws on a gap in ordering', () => {
    expect(() => validateLibrary([make(1), make(3)])).toThrow(/gap|sequence/i)
  })

  it('throws when a story violates the schema', () => {
    const bad = { ...make(1), title: '' }
    expect(() => validateLibrary([bad as Story])).toThrow()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/content/library.test.ts`
Expected: FAIL — cannot resolve `@/content/library`.

- [ ] **Step 3: Write `src/content/library.ts`**

```ts
import { StorySchema, type Story } from './schema'
import { story as creation } from './stories/001-creation'
import { story as noah } from './stories/002-noah-and-the-flood'
import { story as birthOfJesus } from './stories/003-the-birth-of-jesus'

export function sortByOrder(stories: Story[]): Story[] {
  return [...stories].sort((a, b) => a.order - b.order)
}

export function validateLibrary(stories: Story[]): Story[] {
  stories.forEach((s) => StorySchema.parse(s))
  const sorted = sortByOrder(stories)
  const seen = new Set<number>()
  sorted.forEach((s, i) => {
    if (seen.has(s.order)) throw new Error(`duplicate order: ${s.order}`)
    seen.add(s.order)
    if (s.order !== i + 1) {
      throw new Error(`order sequence gap: expected ${i + 1}, got ${s.order}`)
    }
  })
  return sorted
}

const RAW: Story[] = [creation, noah, birthOfJesus]

export const STORIES: Story[] = validateLibrary(RAW)

export function getAllStories(): Story[] {
  return STORIES
}

export function getStoryByOrder(order: number): Story | undefined {
  return STORIES.find((s) => s.order === order)
}

export function getAdjacent(order: number): { prev?: Story; next?: Story } {
  const idx = STORIES.findIndex((s) => s.order === order)
  return {
    prev: idx > 0 ? STORIES[idx - 1] : undefined,
    next: idx >= 0 && idx < STORIES.length - 1 ? STORIES[idx + 1] : undefined,
  }
}
```

Note: the `import` of the three story files means this task cannot compile until Task 5 creates them. Execute Task 5 before running the full build, but the unit test above only imports `validateLibrary`/`sortByOrder`, which are defined regardless. If Vitest fails to resolve the story imports during this test, complete Task 5 first, then re-run.

- [ ] **Step 4: Run test to verify it passes**

Run (after Task 5 if needed): `npm test -- tests/content/library.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add src/content/library.ts tests/content/library.test.ts
git commit -m "feat: add library loader with gapless-order validation"
```

---

## Task 5: Author the three starter stories

**Files:**
- Create: `src/content/stories/001-creation.ts`, `002-noah-and-the-flood.ts`, `003-the-birth-of-jesus.ts`

This task produces **reviewed content**, not just code. Each file exports a `Story` object that passes `StorySchema`. During execution, draft the prose with the style guide below and **review each story with the user before committing** (biblically faithful? age-appropriate? reads well aloud? no invented events?).

**Style guide (all bands):** calm bedtime tone, read-aloud rhythm, Protestant framing, faithful to the source passage, no invented events. `3-5` = short, simple words, 1 takeaway, usually no `historicalContext`, few/no cross-references. `6-8` = a little more detail, 1–2 takeaways, optional light context. `9-12` = fuller narrative, 2–3 takeaways, real historical context and 1–2 real cross-references. `body` may contain multiple paragraphs separated by `\n\n`.

- [ ] **Step 1: Create `src/content/stories/001-creation.ts` in this exact shape**

```ts
import type { Story } from '../schema'

export const story: Story = {
  order: 1,
  era: 'Creation',
  title: 'God Makes the World',
  sourcePassage: 'Genesis 1–2',
  teaser: 'God speaks, and light, sky, sea, and living things appear.',
  bands: {
    '3-5': {
      body: 'DRAFT: a short, gentle retelling of creation for little ones. Multiple short paragraphs separated by two newlines.',
      themes: ['God is the Maker of everything'],
      takeaways: ['God made the whole world, and it was good.'],
      crossReferences: [],
      pronunciationHints: [],
    },
    '6-8': {
      body: 'DRAFT: a slightly fuller retelling across the days of creation.',
      themes: ['God is Creator', 'Everything God made is good'],
      takeaways: ['God made everything with care.', 'People are made in God’s image.'],
      historicalContext: 'Genesis is the first book of the Bible; it tells how everything began.',
      crossReferences: [{ reference: 'John 1:1–3', note: 'Jesus, the Word, was with God at creation.' }],
      pronunciationHints: [],
    },
    '9-12': {
      body: 'DRAFT: a full read-aloud retelling of the seven days and the garden.',
      themes: ['God is Creator', 'Order and goodness of creation', 'Humanity’s role as caretakers'],
      takeaways: [
        'God created everything out of nothing, simply by speaking.',
        'People are made in God’s image to care for creation.',
        'God rested on the seventh day, setting a rhythm for us.',
      ],
      historicalContext: 'Genesis opens the Torah, the first five books of the Bible, traditionally connected with Moses.',
      crossReferences: [
        { reference: 'John 1:1–3', note: 'The Word (Jesus) was present and active in creation.' },
        { reference: 'Psalm 19:1', note: 'Creation still declares the glory of God.' },
      ],
      pronunciationHints: [{ name: 'Genesis', pronunciation: 'JEN-uh-sis' }],
    },
  },
}
```

- [ ] **Step 2: Create `002-noah-and-the-flood.ts`** with `order: 2`, `era: 'Creation'`, `sourcePassage: 'Genesis 6–9'`, following the identical field structure and the style guide. Draft prose per band; include real cross-references (e.g., `1 Peter 3:20–21`, `Hebrews 11:7`) for `9-12`.

- [ ] **Step 3: Create `003-the-birth-of-jesus.ts`** with `order: 3`, `era: 'Life of Jesus'`, `sourcePassage: 'Luke 2:1–20'`, following the identical field structure and the style guide. Real cross-references for `9-12` (e.g., `Isaiah 9:6`, `John 3:16`).

- [ ] **Step 4: Validate content against the schema**

Add `tests/content/stories.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { getAllStories } from '@/content/library'
import { StorySchema } from '@/content/schema'

describe('starter library content', () => {
  const stories = getAllStories()

  it('has three stories', () => {
    expect(stories).toHaveLength(3)
  })

  it('every story matches the schema', () => {
    stories.forEach((s) => expect(() => StorySchema.parse(s)).not.toThrow())
  })

  it('no draft placeholders remain', () => {
    stories.forEach((s) =>
      Object.values(s.bands).forEach((b) => expect(b.body).not.toMatch(/DRAFT:/)),
    )
  })
})
```

- [ ] **Step 5: Run tests**

Run: `npm test -- tests/content/stories.test.ts tests/content/library.test.ts`
Expected: the schema/length tests PASS; the `no draft placeholders` test FAILS until real prose replaces the `DRAFT:` text. Replace all `DRAFT:` bodies with reviewed prose, then re-run.
Expected after authoring: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/content/stories tests/content/stories.test.ts
git commit -m "feat: author three starter stories across age bands"
```

---

## Task 6: Progress persistence (pure localStorage layer)

**Files:**
- Create: `src/lib/progress.ts`
- Test: `tests/lib/progress.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/lib/progress.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest'
import {
  loadProgress,
  markRead,
  toggleFavorite,
  setLastRead,
  emptyProgress,
} from '@/lib/progress'

beforeEach(() => localStorage.clear())

describe('progress', () => {
  it('returns empty progress when nothing is stored', () => {
    expect(loadProgress()).toEqual(emptyProgress())
  })

  it('marks a story read (idempotent)', () => {
    markRead(2)
    markRead(2)
    expect(loadProgress().read).toEqual([2])
  })

  it('toggles a favorite on and off', () => {
    toggleFavorite(5)
    expect(loadProgress().favorites).toEqual([5])
    toggleFavorite(5)
    expect(loadProgress().favorites).toEqual([])
  })

  it('records the last read story', () => {
    setLastRead(3)
    expect(loadProgress().lastRead).toBe(3)
  })

  it('recovers from corrupt storage', () => {
    localStorage.setItem('biblestories.progress', '{not json')
    expect(loadProgress()).toEqual(emptyProgress())
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/lib/progress.test.ts`
Expected: FAIL — cannot resolve `@/lib/progress`.

- [ ] **Step 3: Write `src/lib/progress.ts`**

```ts
export interface Progress {
  read: number[]
  favorites: number[]
  lastRead: number | null
}

const KEY = 'biblestories.progress'

export function emptyProgress(): Progress {
  return { read: [], favorites: [], lastRead: null }
}

function isProgress(v: unknown): v is Progress {
  if (typeof v !== 'object' || v === null) return false
  const p = v as Record<string, unknown>
  return (
    Array.isArray(p.read) &&
    Array.isArray(p.favorites) &&
    (p.lastRead === null || typeof p.lastRead === 'number')
  )
}

export function loadProgress(): Progress {
  if (typeof localStorage === 'undefined') return emptyProgress()
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyProgress()
    const parsed = JSON.parse(raw)
    return isProgress(parsed) ? parsed : emptyProgress()
  } catch {
    return emptyProgress()
  }
}

function save(p: Progress): Progress {
  if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, JSON.stringify(p))
  return p
}

export function markRead(order: number): Progress {
  const p = loadProgress()
  if (!p.read.includes(order)) p.read.push(order)
  return save(p)
}

export function toggleFavorite(order: number): Progress {
  const p = loadProgress()
  p.favorites = p.favorites.includes(order)
    ? p.favorites.filter((o) => o !== order)
    : [...p.favorites, order]
  return save(p)
}

export function setLastRead(order: number): Progress {
  const p = loadProgress()
  p.lastRead = order
  return save(p)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/lib/progress.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/progress.ts tests/lib/progress.test.ts
git commit -m "feat: add localStorage progress layer"
```

---

## Task 7: React hooks for age band and progress

**Files:**
- Create: `src/lib/useAgeBand.ts`, `src/lib/useProgress.ts`
- Test: `tests/lib/useAgeBand.test.tsx`

- [ ] **Step 1: Write the failing test**

`tests/lib/useAgeBand.test.tsx`:
```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAgeBand } from '@/lib/useAgeBand'
import { DEFAULT_AGE_BAND } from '@/content/ageBands'

beforeEach(() => localStorage.clear())

describe('useAgeBand', () => {
  it('defaults when nothing stored', () => {
    const { result } = renderHook(() => useAgeBand())
    expect(result.current.ageBand).toBe(DEFAULT_AGE_BAND)
  })

  it('persists a chosen band', () => {
    const { result } = renderHook(() => useAgeBand())
    act(() => result.current.setAgeBand('9-12'))
    expect(result.current.ageBand).toBe('9-12')
    expect(localStorage.getItem('biblestories.ageBand')).toBe('9-12')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/lib/useAgeBand.test.tsx`
Expected: FAIL — cannot resolve `@/lib/useAgeBand`.

- [ ] **Step 3: Write `src/lib/useAgeBand.ts`**

```ts
'use client'
import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_AGE_BAND, isAgeBand } from '@/content/ageBands'
import type { AgeBand } from '@/content/schema'

const KEY = 'biblestories.ageBand'

export function useAgeBand() {
  const [ageBand, setBand] = useState<AgeBand>(DEFAULT_AGE_BAND)

  useEffect(() => {
    const stored = localStorage.getItem(KEY)
    if (isAgeBand(stored)) setBand(stored)
  }, [])

  const setAgeBand = useCallback((band: AgeBand) => {
    setBand(band)
    localStorage.setItem(KEY, band)
  }, [])

  return { ageBand, setAgeBand }
}
```

- [ ] **Step 4: Write `src/lib/useProgress.ts`**

```ts
'use client'
import { useCallback, useEffect, useState } from 'react'
import {
  emptyProgress,
  loadProgress,
  markRead as persistRead,
  toggleFavorite as persistFav,
  setLastRead as persistLast,
  type Progress,
} from '@/lib/progress'

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(emptyProgress())

  useEffect(() => setProgress(loadProgress()), [])

  const markRead = useCallback((order: number) => setProgress(persistRead(order)), [])
  const toggleFavorite = useCallback((order: number) => setProgress(persistFav(order)), [])
  const setLastRead = useCallback((order: number) => setProgress(persistLast(order)), [])

  return { progress, markRead, toggleFavorite, setLastRead }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- tests/lib/useAgeBand.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 6: Commit**

```bash
git add src/lib/useAgeBand.ts src/lib/useProgress.ts tests/lib/useAgeBand.test.tsx
git commit -m "feat: add age-band and progress React hooks"
```

---

## Task 8: Root layout and bedtime theme

**Files:**
- Modify: `src/app/layout.tsx`, `src/app/globals.css`

- [ ] **Step 1: Replace `src/app/globals.css`** with a warm, low-glare bedtime theme

```css
@import 'tailwindcss';

:root {
  --bg: #f6efe3;        /* soft cream */
  --surface: #efe6d5;
  --ink: #3a2f26;       /* warm dark brown */
  --muted: #7a6a58;
  --accent: #8a5a44;    /* muted clay */
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1c1a17;      /* deep dusk */
    --surface: #262320;
    --ink: #ece3d4;
    --muted: #a89b88;
    --accent: #c8926f;
  }
}

body {
  background: var(--bg);
  color: var(--ink);
  font-family: Georgia, 'Times New Roman', serif;
  line-height: 1.8;
}
```

- [ ] **Step 2: Replace `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bedtime Bible Stories',
  description: 'Calm, chronological Bible stories to read aloud at bedtime.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto max-w-2xl px-5 py-8">{children}</div>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Verify the dev build renders**

Run: `npm run build`
Expected: build succeeds (stories from Task 5 present).

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat: add warm bedtime theme and root layout"
```

---

## Task 9: AgeBandPicker component

**Files:**
- Create: `src/components/AgeBandPicker.tsx`
- Test: `tests/components/AgeBandPicker.test.tsx`

- [ ] **Step 1: Write the failing test**

`tests/components/AgeBandPicker.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AgeBandPicker } from '@/components/AgeBandPicker'

describe('AgeBandPicker', () => {
  it('renders all three bands and marks the selected one', () => {
    render(<AgeBandPicker value="6-8" onChange={() => {}} />)
    expect(screen.getByRole('button', { name: /Ages 3–5/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Ages 6–8/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /Ages 9–12/ })).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onChange with the chosen band', async () => {
    const onChange = vi.fn()
    render(<AgeBandPicker value="6-8" onChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: /Ages 9–12/ }))
    expect(onChange).toHaveBeenCalledWith('9-12')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/components/AgeBandPicker.test.tsx`
Expected: FAIL — cannot resolve component.

- [ ] **Step 3: Write `src/components/AgeBandPicker.tsx`**

```tsx
'use client'
import { AGE_BANDS } from '@/content/ageBands'
import type { AgeBand } from '@/content/schema'

export function AgeBandPicker({
  value,
  onChange,
}: {
  value: AgeBand
  onChange: (band: AgeBand) => void
}) {
  return (
    <div className="flex flex-wrap gap-3" role="group" aria-label="Choose child's age">
      {AGE_BANDS.map((b) => (
        <button
          key={b.key}
          type="button"
          aria-pressed={value === b.key}
          onClick={() => onChange(b.key)}
          className={`rounded-xl border px-4 py-3 text-left transition ${
            value === b.key ? 'border-[var(--accent)] bg-[var(--surface)]' : 'border-transparent'
          }`}
        >
          <span className="block font-semibold">{b.label}</span>
          <span className="block text-sm text-[var(--muted)]">{b.blurb}</span>
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/components/AgeBandPicker.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/AgeBandPicker.tsx tests/components/AgeBandPicker.test.tsx
git commit -m "feat: add AgeBandPicker component"
```

---

## Task 10: StoryCard and EraSection, then the library home page

**Files:**
- Create: `src/components/StoryCard.tsx`, `src/components/EraSection.tsx`
- Modify: `src/app/page.tsx`
- Test: `tests/components/EraSection.test.tsx`

- [ ] **Step 1: Write `src/components/StoryCard.tsx`**

```tsx
import Link from 'next/link'
import type { Story } from '@/content/schema'

export function StoryCard({ story, isRead }: { story: Story; isRead: boolean }) {
  return (
    <Link
      href={`/story/${story.order}`}
      className="block rounded-xl border border-[var(--surface)] bg-[var(--surface)] px-4 py-3"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold">{story.title}</span>
        {isRead && <span aria-label="read" title="Read">✓</span>}
      </div>
      <span className="block text-sm text-[var(--muted)]">{story.sourcePassage}</span>
      <span className="block text-sm">{story.teaser}</span>
    </Link>
  )
}
```

- [ ] **Step 2: Write the failing test for EraSection**

`tests/components/EraSection.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EraSection } from '@/components/EraSection'
import type { Story } from '@/content/schema'

const story: Story = {
  order: 1, era: 'Creation', title: 'God Makes the World',
  sourcePassage: 'Genesis 1–2', teaser: 'God speaks the world into being.',
  bands: {
    '3-5': { body: 'b', themes: ['t'], takeaways: ['k'], crossReferences: [], pronunciationHints: [] },
    '6-8': { body: 'b', themes: ['t'], takeaways: ['k'], crossReferences: [], pronunciationHints: [] },
    '9-12': { body: 'b', themes: ['t'], takeaways: ['k'], crossReferences: [], pronunciationHints: [] },
  },
}

describe('EraSection', () => {
  it('shows the era heading and its stories', () => {
    render(<EraSection era="Creation" stories={[story]} readSet={new Set()} />)
    expect(screen.getByRole('heading', { name: 'Creation' })).toBeInTheDocument()
    expect(screen.getByText('God Makes the World')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- tests/components/EraSection.test.tsx`
Expected: FAIL — cannot resolve component.

- [ ] **Step 4: Write `src/components/EraSection.tsx`**

```tsx
import type { Era, Story } from '@/content/schema'
import { StoryCard } from './StoryCard'

export function EraSection({
  era,
  stories,
  readSet,
}: {
  era: Era
  stories: Story[]
  readSet: Set<number>
}) {
  if (stories.length === 0) return null
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-bold text-[var(--accent)]">{era}</h2>
      <div className="flex flex-col gap-3">
        {stories.map((s) => (
          <StoryCard key={s.order} story={s} isRead={readSet.has(s.order)} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- tests/components/EraSection.test.tsx`
Expected: PASS.

- [ ] **Step 6: Write the home page `src/app/page.tsx`** (client component: reads localStorage for progress + age band, groups stories by era, shows continue link)

```tsx
'use client'
import Link from 'next/link'
import { getAllStories } from '@/content/library'
import { ERAS } from '@/content/eras'
import { EraSection } from '@/components/EraSection'
import { AgeBandPicker } from '@/components/AgeBandPicker'
import { useAgeBand } from '@/lib/useAgeBand'
import { useProgress } from '@/lib/useProgress'

export default function HomePage() {
  const stories = getAllStories()
  const { ageBand, setAgeBand } = useAgeBand()
  const { progress } = useProgress()
  const readSet = new Set(progress.read)
  const last = progress.lastRead

  return (
    <main>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Bedtime Bible Stories</h1>
        <p className="text-[var(--muted)]">Read aloud, one story at a time, through the whole Bible.</p>
      </header>

      <div className="mb-6">
        <p className="mb-2 text-sm font-semibold">Who are we reading to tonight?</p>
        <AgeBandPicker value={ageBand} onChange={setAgeBand} />
      </div>

      {last != null && (
        <Link
          href={`/story/${last}`}
          className="mb-6 block rounded-xl border border-[var(--accent)] px-4 py-3 font-semibold"
        >
          Continue where you left off →
        </Link>
      )}

      {ERAS.map((era) => (
        <EraSection
          key={era}
          era={era}
          stories={stories.filter((s) => s.era === era)}
          readSet={readSet}
        />
      ))}
    </main>
  )
}
```

- [ ] **Step 7: Run the full test suite and a build**

Run: `npm test && npm run build`
Expected: all tests PASS; build succeeds.

- [ ] **Step 8: Commit**

```bash
git add src/components/StoryCard.tsx src/components/EraSection.tsx src/app/page.tsx tests/components/EraSection.test.tsx
git commit -m "feat: add library home page with era grouping and progress"
```

---

## Task 11: Story-view sub-components

**Files:**
- Create: `src/components/StoryBody.tsx`, `src/components/PronunciationHints.tsx`, `src/components/ReflectTogether.tsx`
- Test: `tests/components/ReflectTogether.test.tsx`

- [ ] **Step 1: Write `src/components/StoryBody.tsx`** (splits `body` on blank lines into paragraphs)

```tsx
export function StoryBody({ body }: { body: string }) {
  const paragraphs = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  return (
    <div className="text-xl leading-loose">
      {paragraphs.map((p, i) => (
        <p key={i} className="mb-5">
          {p}
        </p>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Write `src/components/PronunciationHints.tsx`**

```tsx
import type { PronunciationHint } from '@/content/schema'

export function PronunciationHints({ hints }: { hints: PronunciationHint[] }) {
  if (hints.length === 0) return null
  return (
    <details className="mb-4 text-sm text-[var(--muted)]">
      <summary className="cursor-pointer">How do I say the names?</summary>
      <ul className="mt-2 list-disc pl-5">
        {hints.map((h) => (
          <li key={h.name}>
            <strong>{h.name}</strong> — {h.pronunciation}
          </li>
        ))}
      </ul>
    </details>
  )
}
```

- [ ] **Step 3: Write the failing test for ReflectTogether**

`tests/components/ReflectTogether.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReflectTogether } from '@/components/ReflectTogether'
import type { AgeBandContent } from '@/content/schema'

const content: AgeBandContent = {
  body: 'b',
  themes: ['God is Creator'],
  takeaways: ['God made everything.'],
  historicalContext: 'Genesis opens the Bible.',
  crossReferences: [{ reference: 'John 1:1', note: 'Jesus at creation.' }],
  pronunciationHints: [],
}

describe('ReflectTogether', () => {
  it('renders themes, takeaways, context and cross-references', () => {
    render(<ReflectTogether content={content} />)
    expect(screen.getByText('God is Creator')).toBeInTheDocument()
    expect(screen.getByText('God made everything.')).toBeInTheDocument()
    expect(screen.getByText(/Genesis opens the Bible/)).toBeInTheDocument()
    expect(screen.getByText(/John 1:1/)).toBeInTheDocument()
  })

  it('omits context section when absent', () => {
    render(<ReflectTogether content={{ ...content, historicalContext: undefined }} />)
    expect(screen.queryByText(/A little history/)).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npm test -- tests/components/ReflectTogether.test.tsx`
Expected: FAIL — cannot resolve component.

- [ ] **Step 5: Write `src/components/ReflectTogether.tsx`**

```tsx
import type { AgeBandContent } from '@/content/schema'

export function ReflectTogether({ content }: { content: AgeBandContent }) {
  return (
    <section className="mt-10 border-t border-[var(--surface)] pt-6 text-base">
      <h2 className="mb-4 text-lg font-bold text-[var(--accent)]">Reflect together</h2>

      <h3 className="font-semibold">Themes</h3>
      <ul className="mb-4 list-disc pl-5">
        {content.themes.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      <h3 className="font-semibold">What we learn</h3>
      <ul className="mb-4 list-disc pl-5">
        {content.takeaways.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      {content.historicalContext && (
        <>
          <h3 className="font-semibold">A little history</h3>
          <p className="mb-4">{content.historicalContext}</p>
        </>
      )}

      {content.crossReferences.length > 0 && (
        <>
          <h3 className="font-semibold">Related verses</h3>
          <ul className="list-disc pl-5">
            {content.crossReferences.map((c) => (
              <li key={c.reference}>
                <strong>{c.reference}</strong> — {c.note}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- tests/components/ReflectTogether.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 7: Commit**

```bash
git add src/components/StoryBody.tsx src/components/PronunciationHints.tsx src/components/ReflectTogether.tsx tests/components/ReflectTogether.test.tsx
git commit -m "feat: add story-view sub-components"
```

---

## Task 12: Story page route (SSG, band switch, prev/next, mark-read, favorite)

**Files:**
- Create: `src/app/story/[order]/page.tsx`, `src/app/story/[order]/StoryReader.tsx`
- Test: `tests/components/StoryReader.test.tsx`

The route `page.tsx` is a server component that provides `generateStaticParams` (SSG per story) and passes the full `Story` + adjacency to a client `StoryReader`.

- [ ] **Step 1: Write `src/app/story/[order]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import { getAllStories, getStoryByOrder, getAdjacent } from '@/content/library'
import { StoryReader } from './StoryReader'

export function generateStaticParams() {
  return getAllStories().map((s) => ({ order: String(s.order) }))
}

export default async function StoryPage({ params }: { params: Promise<{ order: string }> }) {
  const { order } = await params
  const story = getStoryByOrder(Number(order))
  if (!story) notFound()
  const { prev, next } = getAdjacent(story.order)
  return (
    <StoryReader
      story={story}
      prevOrder={prev?.order ?? null}
      nextOrder={next?.order ?? null}
    />
  )
}
```

- [ ] **Step 2: Write the failing test for StoryReader**

`tests/components/StoryReader.test.tsx`:
```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StoryReader } from '@/app/story/[order]/StoryReader'
import { loadProgress } from '@/lib/progress'
import type { Story } from '@/content/schema'

const story: Story = {
  order: 1, era: 'Creation', title: 'God Makes the World',
  sourcePassage: 'Genesis 1–2', teaser: 'God speaks the world into being.',
  bands: {
    '3-5': { body: 'Little body.', themes: ['t3'], takeaways: ['k3'], crossReferences: [], pronunciationHints: [] },
    '6-8': { body: 'Middle body.', themes: ['t6'], takeaways: ['k6'], crossReferences: [], pronunciationHints: [] },
    '9-12': { body: 'Older body.', themes: ['t9'], takeaways: ['k9'], crossReferences: [], pronunciationHints: [] },
  },
}

beforeEach(() => localStorage.clear())

describe('StoryReader', () => {
  it('renders the body for the default age band and the title', () => {
    render(<StoryReader story={story} prevOrder={null} nextOrder={2} />)
    expect(screen.getByRole('heading', { name: 'God Makes the World' })).toBeInTheDocument()
    expect(screen.getByText('Middle body.')).toBeInTheDocument() // default band 6-8
  })

  it('marks the story read and records last-read on mount', () => {
    render(<StoryReader story={story} prevOrder={null} nextOrder={2} />)
    const p = loadProgress()
    expect(p.read).toContain(1)
    expect(p.lastRead).toBe(1)
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- tests/components/StoryReader.test.tsx`
Expected: FAIL — cannot resolve `StoryReader`.

- [ ] **Step 4: Write `src/app/story/[order]/StoryReader.tsx`**

```tsx
'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import type { Story } from '@/content/schema'
import { StoryBody } from '@/components/StoryBody'
import { PronunciationHints } from '@/components/PronunciationHints'
import { ReflectTogether } from '@/components/ReflectTogether'
import { AgeBandPicker } from '@/components/AgeBandPicker'
import { useAgeBand } from '@/lib/useAgeBand'
import { useProgress } from '@/lib/useProgress'

export function StoryReader({
  story,
  prevOrder,
  nextOrder,
}: {
  story: Story
  prevOrder: number | null
  nextOrder: number | null
}) {
  const { ageBand, setAgeBand } = useAgeBand()
  const { progress, markRead, toggleFavorite, setLastRead } = useProgress()
  const content = story.bands[ageBand]

  useEffect(() => {
    markRead(story.order)
    setLastRead(story.order)
  }, [story.order, markRead, setLastRead])

  const isFav = progress.favorites.includes(story.order)

  return (
    <article>
      <div className="mb-4 flex items-center justify-between text-sm">
        <Link href="/" className="text-[var(--accent)]">← All stories</Link>
        <button
          type="button"
          onClick={() => toggleFavorite(story.order)}
          aria-pressed={isFav}
          aria-label={isFav ? 'Remove favorite' : 'Add favorite'}
        >
          {isFav ? '★ Favorited' : '☆ Favorite'}
        </button>
      </div>

      <h1 className="text-2xl font-bold">{story.title}</h1>
      <p className="mb-4 text-[var(--muted)]">{story.sourcePassage}</p>

      <div className="mb-6">
        <AgeBandPicker value={ageBand} onChange={setAgeBand} />
      </div>

      <PronunciationHints hints={content.pronunciationHints} />
      <StoryBody body={content.body} />
      <ReflectTogether content={content} />

      <nav className="mt-10 flex justify-between text-[var(--accent)]">
        {prevOrder != null ? <Link href={`/story/${prevOrder}`}>← Previous</Link> : <span />}
        {nextOrder != null ? <Link href={`/story/${nextOrder}`}>Next →</Link> : <span />}
      </nav>
    </article>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- tests/components/StoryReader.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 6: Full suite + build**

Run: `npm test && npm run build`
Expected: all tests PASS; build produces static pages for `/` and each `/story/[order]`.

- [ ] **Step 7: Commit**

```bash
git add "src/app/story" tests/components/StoryReader.test.tsx
git commit -m "feat: add story reader route with band switch, progress, and navigation"
```

---

## Task 13: README and deploy notes

**Files:**
- Create/Modify: `README.md`

- [ ] **Step 1: Write `README.md`**

````markdown
# Bedtime Bible Stories

A calm, bedtime-friendly website where a parent picks a child's age band and reads a
chronological, Protestant-canon Bible story aloud. Stories are pre-authored content
files; there is no runtime LLM, no database, and no login in this MVP. Progress and age
band are stored in the browser.

## Develop
```bash
npm install
npm run dev      # http://localhost:3000
npm test         # run the test suite
npm run build    # static production build
```

## Content
Stories live in `src/content/stories/` as typed modules validated by `src/content/schema.ts`.
Add a story by creating `NNN-title.ts` exporting a `Story`, then adding it to the `RAW`
array in `src/content/library.ts`. `order` values must be unique and gapless starting at 1.

## Deploy
Deploy to Vercel (personal scope): `vercel --scope jameshelou-1395s-projects`.
The site is fully static (SSG).

## Roadmap
- Phase 2: optional live "generate a story" feature behind a flag (adds API key + DB).
- Phase 3: optional TTS voice narration.
````

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with develop, content, and deploy notes"
```

---

## Task 14: Final verification and push

- [ ] **Step 1: Run the whole suite and build once more**

Run: `npm test && npm run build`
Expected: all tests PASS; clean build.

- [ ] **Step 2: Push to the remote**

```bash
git push -u origin HEAD
```
Expected: branch pushed to `ryan-helou/BibleStories`.

---

## Self-Review Notes (author checklist — done during writing)

- **Spec coverage:** age bands (T3, T9), Protestant/chronological library + eras (T2, T3, T4, T10), story content model incl. themes/takeaways/context/cross-refs/pronunciation (T2, T5, T11), read-aloud bedtime UI (T8, T10, T11, T12), localStorage progress incl. continue/read/favorite (T6, T7, T10, T12), no login/no DB/no runtime LLM (architecture; T6 pure localStorage), 3-story starter slice (T5), build-time authoring + accuracy checklist (T5), testing incl. schema/gapless validation (T2, T4, T5) — all mapped.
- **Placeholders:** the only intentional `DRAFT:` markers are in T5 story bodies, guarded by a failing test (T5 Step 5) that blocks commit until real reviewed prose replaces them. No other placeholders.
- **Type consistency:** `Story`, `AgeBand`, `AgeBandContent`, `CrossReference`, `PronunciationHint` from `schema.ts` are used consistently; `useAgeBand`/`useProgress` signatures match their consumers in T10/T12; `getAllStories`/`getStoryByOrder`/`getAdjacent` names consistent across T4, T10, T12.
