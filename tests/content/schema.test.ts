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
