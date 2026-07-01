import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { parseVerse } from '@/lib/customStory'
import { VERSE_SYSTEM_PROMPT, buildVersePrompt } from '@/lib/storyPrompt'

export const maxDuration = 30

// Sonnet 5 — better at pinning the verse to the story's actual passage than
// Haiku. This is a short, cheap call made once after the story finishes.
const MODEL = 'claude-sonnet-5'

const BodySchema = z.object({
  description: z.string().trim().min(3).max(600),
  story: z.string().trim().max(8000).optional(),
})

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'Server is missing ANTHROPIC_API_KEY.' }, { status: 500 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const client = new Anthropic()
  try {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 300,
      thinking: { type: 'disabled' },
      system: VERSE_SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: buildVersePrompt(parsed.data.description, parsed.data.story) },
      ],
    })

    const block = res.content.find((b) => b.type === 'text')
    const raw = block && 'text' in block ? block.text.trim() : ''
    if (!raw) return Response.json({ error: 'No verse returned.' }, { status: 502 })

    const verse = parseVerse(raw)
    return Response.json(verse)
  } catch {
    return Response.json({ error: 'Could not find a verse.' }, { status: 502 })
  }
}
