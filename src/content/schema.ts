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
