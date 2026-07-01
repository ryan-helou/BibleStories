import type { Story } from '../schema'

export const story: Story = {
  order: 1,
  era: 'Creation',
  title: 'God Makes the World',
  sourcePassage: 'Genesis 1–2',
  teaser: 'God speaks, and light, sky, sea, and living things appear.',
  bands: {
    '3-5': {
      body: 'DRAFT: creation retelling for ages 3-5.',
      themes: ['God is the Maker of everything'],
      takeaways: ['God made the whole world, and it was good.'],
      crossReferences: [],
      pronunciationHints: [],
    },
    '6-8': {
      body: 'DRAFT: creation retelling for ages 6-8.',
      themes: ['God is Creator', 'Everything God made is good'],
      takeaways: ['God made everything with care.'],
      historicalContext: 'Genesis is the first book of the Bible; it tells how everything began.',
      crossReferences: [{ reference: 'John 1:1–3', note: 'Jesus, the Word, was with God at creation.' }],
      pronunciationHints: [],
    },
    '9-12': {
      body: 'DRAFT: creation retelling for ages 9-12.',
      themes: ['God is Creator', 'Order and goodness of creation'],
      takeaways: ['God created everything out of nothing, simply by speaking.'],
      historicalContext: 'Genesis opens the Torah, the first five books of the Bible.',
      crossReferences: [{ reference: 'John 1:1–3', note: 'The Word (Jesus) was present and active in creation.' }],
      pronunciationHints: [{ name: 'Genesis', pronunciation: 'JEN-uh-sis' }],
    },
  },
}
