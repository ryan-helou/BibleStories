import type { Story } from '../schema'

export const story: Story = {
  order: 3,
  era: 'Life of Jesus',
  title: 'The Birth of Jesus',
  sourcePassage: 'Luke 2:1–20',
  teaser: 'A baby is born in Bethlehem, and angels tell shepherds the good news.',
  bands: {
    '3-5': {
      body: 'DRAFT: nativity retelling for ages 3-5.',
      themes: ['Jesus is God’s gift'],
      takeaways: ['God sent baby Jesus.'],
      crossReferences: [],
      pronunciationHints: [{ name: 'Bethlehem', pronunciation: 'BETH-lih-hem' }],
    },
    '6-8': {
      body: 'DRAFT: nativity retelling for ages 6-8.',
      themes: ['God keeps his promises', 'Good news for everyone'],
      takeaways: ['Jesus came for all people, even shepherds.'],
      historicalContext: 'Bethlehem was the hometown of King David, from whose family Jesus came.',
      crossReferences: [{ reference: 'Isaiah 9:6', note: 'A promised child is given.' }],
      pronunciationHints: [{ name: 'Bethlehem', pronunciation: 'BETH-lih-hem' }],
    },
    '9-12': {
      body: 'DRAFT: nativity retelling for ages 9-12.',
      themes: ['Promise fulfilled', 'God with us'],
      takeaways: ['Jesus’ birth fulfilled prophecies made long before.'],
      historicalContext: 'Luke ties the birth to a Roman census under Caesar Augustus, grounding it in history.',
      crossReferences: [
        { reference: 'Isaiah 9:6', note: 'The Messiah foretold centuries earlier.' },
        { reference: 'John 3:16', note: 'God gave his Son out of love.' },
      ],
      pronunciationHints: [{ name: 'Bethlehem', pronunciation: 'BETH-lih-hem' }],
    },
  },
}
