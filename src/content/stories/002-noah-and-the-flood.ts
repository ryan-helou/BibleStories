import type { Story } from '../schema'

export const story: Story = {
  order: 2,
  era: 'Creation',
  title: 'Noah and the Flood',
  sourcePassage: 'Genesis 6–9',
  teaser: 'God saves Noah, his family, and the animals, then hangs a rainbow in the sky.',
  bands: {
    '3-5': {
      body: 'DRAFT: Noah retelling for ages 3-5.',
      themes: ['God keeps his people safe'],
      takeaways: ['God kept Noah safe.'],
      crossReferences: [],
      pronunciationHints: [{ name: 'Noah', pronunciation: 'NOH-uh' }],
    },
    '6-8': {
      body: 'DRAFT: Noah retelling for ages 6-8.',
      themes: ['God keeps his promises', 'Trusting God'],
      takeaways: ['Noah trusted and obeyed God.'],
      historicalContext: 'The rainbow was God’s sign of a promise never to flood the whole earth again.',
      crossReferences: [{ reference: 'Hebrews 11:7', note: 'Noah is remembered for his faith.' }],
      pronunciationHints: [{ name: 'Noah', pronunciation: 'NOH-uh' }],
    },
    '9-12': {
      body: 'DRAFT: Noah retelling for ages 9-12.',
      themes: ['God’s judgment and mercy', 'Faithful obedience'],
      takeaways: ['God judged sin but rescued Noah’s family.'],
      historicalContext: 'The flood account appears early in Genesis, in the era before Abraham.',
      crossReferences: [
        { reference: '1 Peter 3:20–21', note: 'The ark points ahead to salvation.' },
        { reference: 'Hebrews 11:7', note: 'Noah acted by faith on God’s warning.' },
      ],
      pronunciationHints: [{ name: 'Noah', pronunciation: 'NOH-uh' }],
    },
  },
}
