import { z } from 'zod'
import { AGE_BAND_KEYS, type AgeBand } from '@/content/schema'

/**
 * The three inputs that drive a custom story:
 *  - age:         the child's exact age; we categorize it into a band ourselves
 *  - description: free text ("the story of Daniel, focus on his faith through temptation")
 *  - minutes:     desired read-aloud length in minutes (not words)
 */
export const CustomStoryRequestSchema = z.object({
  age: z.number().int().min(1).max(17),
  description: z.string().trim().min(3).max(600),
  minutes: z.number().int().min(1).max(20),
})

export type CustomStoryRequest = z.infer<typeof CustomStoryRequestSchema>

/** Categorize an exact age into one of the app's reading bands. */
export function categorizeAge(age: number): AgeBand {
  if (age <= 5) return '3-5'
  if (age <= 8) return '6-8'
  return '9-12'
}

/**
 * Read-aloud pace for children's storytelling is ~130 words/minute.
 * We convert the requested minutes into a target word count so the model
 * has a concrete length to aim for.
 */
export const WORDS_PER_MINUTE = 130

export function minutesToWordTarget(minutes: number): number {
  return minutes * WORDS_PER_MINUTE
}

interface BandVoice {
  band: AgeBand
  label: string
  /** Guidance handed to the model describing how to write for this band. */
  voice: string
}

const BAND_VOICES: Record<AgeBand, BandVoice> = {
  '3-5': {
    band: '3-5',
    label: 'Ages 3–5',
    voice:
      'Very short, simple sentences. Small, concrete words a preschooler knows. Warm, gentle, and a little repetitive so it soothes. Avoid scary detail, violence, and abstract ideas. One clear feeling and one clear lesson.',
  },
  '6-8': {
    band: '6-8',
    label: 'Ages 6–8',
    voice:
      'Clear narrative with a beginning, middle, and end. A bit more detail and a few named characters. Introduce one or two themes gently. Keep sentences short-to-medium and vocabulary approachable.',
  },
  '9-12': {
    band: '9-12',
    label: 'Ages 9–12',
    voice:
      'A fuller, richer retelling with setting, motivation, and light historical context. Can handle nuance, mild tension, and deeper themes. Still age-appropriate — no graphic content — but respects the reader\'s growing understanding.',
  },
}

export function bandVoice(band: AgeBand): BandVoice {
  return BAND_VOICES[band]
}

export function isAgeBandKey(value: string): value is AgeBand {
  return (AGE_BAND_KEYS as readonly string[]).includes(value)
}

// --- Parsing the generated output ---------------------------------------
// The model streams the story, then a trailer with a few takeaways and one
// verse, separated by these markers. We parse it out for display.

export const TAKEAWAYS_MARKER = '===TAKEAWAYS==='
export const VERSE_MARKER = '===VERSE==='

export interface Verse {
  text: string
  reference: string | null
}

export interface ParsedStory {
  story: string
  takeaways: string[]
  verse: Verse | null
}

function stripTrailingMarker(s: string): string {
  // While streaming, hide a partially-arrived trailing marker like "\n===TAK".
  return s.replace(/\n*=+[A-Za-z]*\s*$/, '')
}

export function parseVerse(block: string): Verse {
  // Expected: "verse text" — Book 1:1 (tolerate curly quotes and en/em dashes).
  const quoted = block.match(/^["“]([\s\S]+?)["”]\s*[—–-]\s*([\s\S]+?)\s*$/)
  if (quoted) return { text: quoted[1].trim(), reference: quoted[2].trim() }

  for (const sep of [' — ', ' – ', ' - ']) {
    const i = block.lastIndexOf(sep)
    if (i >= 0) {
      return {
        text: block.slice(0, i).replace(/^["“]|["”]$/g, '').trim(),
        reference: block.slice(i + sep.length).trim() || null,
      }
    }
  }
  return { text: block.replace(/^["“]|["”]$/g, '').trim(), reference: null }
}

export function parseGeneratedStory(raw: string): ParsedStory {
  const takeIdx = raw.indexOf(TAKEAWAYS_MARKER)
  const verseIdx = raw.indexOf(VERSE_MARKER)

  const storyEnd = takeIdx >= 0 ? takeIdx : raw.length
  const story = stripTrailingMarker(raw.slice(0, storyEnd)).trim()

  let takeaways: string[] = []
  if (takeIdx >= 0) {
    const end = verseIdx > takeIdx ? verseIdx : raw.length
    takeaways = raw
      .slice(takeIdx + TAKEAWAYS_MARKER.length, end)
      .split('\n')
      .map((line) => line.replace(/^\s*[-*•]\s*/, '').trim())
      .filter(Boolean)
  }

  let verse: Verse | null = null
  if (verseIdx >= 0) {
    const block = raw.slice(verseIdx + VERSE_MARKER.length).trim()
    if (block) verse = parseVerse(block)
  }

  return { story, takeaways, verse }
}
