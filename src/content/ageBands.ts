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
