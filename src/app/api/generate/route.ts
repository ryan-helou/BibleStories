import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { CustomStoryRequestSchema } from '@/lib/customStory'
import { SYSTEM_PROMPT, buildUserPrompt } from '@/lib/storyPrompt'

// Story generation can take a while for longer requests; give the route room.
export const maxDuration = 60

// Haiku 4.5 — the cheapest model (~$1 in / $5 out per M tokens), ~0.4¢ per story.
// Swap to 'claude-sonnet-5' or 'claude-opus-4-8' for higher-quality retellings.
const MODEL = 'claude-haiku-4-5'

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: 'Server is missing ANTHROPIC_API_KEY. Add it to .env.local and restart.' },
      { status: 500 },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const parsed = CustomStoryRequestSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid request.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const client = new Anthropic()
  const anthropicStream = client.messages.stream({
    model: MODEL,
    max_tokens: 6000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserPrompt(parsed.data) }],
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of anthropicStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
    cancel() {
      anthropicStream.abort()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
