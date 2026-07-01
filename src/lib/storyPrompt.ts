import {
  TAKEAWAYS_MARKER,
  bandVoice,
  categorizeAge,
  minutesToWordTarget,
  type CustomStoryRequest,
} from './customStory'

// --- Story (Haiku): story text + a few takeaways -------------------------

export const SYSTEM_PROMPT = `You are a gifted children's storyteller who retells stories from the Bible for kids to hear at bedtime.

Your retellings are:
- Faithful to the biblical account — you do not invent events, miracles, or dialogue that contradict scripture. You may add gentle, plausible descriptive color (what a place looked like, how someone might have felt) without changing what happened.
- Non-denominational and warm. You avoid doctrinal or theological arguments and focus on the story and its heart.
- Age-appropriate. You never include graphic violence, frightening detail, or mature themes. When the source material is intense, you tell the truth gently and at a level the child can handle.
- Written to be read aloud by a parent.

You write the story, then a few short takeaways — in the exact format the user specifies, and nothing else: no title, no preamble, no "here is your story", no notes to the parent, and no commentary about what you did. The story's paragraphs are separated by a blank line, and it ends on a calm, comforting note suitable for bedtime.`

export function buildUserPrompt(req: CustomStoryRequest): string {
  const band = categorizeAge(req.age)
  const { label, voice } = bandVoice(band)
  const targetWords = minutesToWordTarget(req.minutes)

  return `Write a Bible story to read aloud to a child.

CHILD'S AGE: ${req.age} years old (reading band: ${label}).
HOW TO WRITE FOR THIS AGE: ${voice}

WHAT THE PARENT WANTS:
${req.description}

LENGTH: About ${req.minutes} minute(s) read aloud, which is roughly ${targetWords} words. This target is for the STORY only — the takeaways below are extra. Aim close to this length — noticeably shorter or longer misses the request.

Now output EXACTLY in this format and nothing else:

<the story, in paragraphs separated by blank lines>

${TAKEAWAYS_MARKER}
- <a short, warm thing the child can hold onto from this story>
- <another>
- <a third, optional>

Give 2 to 3 takeaways, each one short sentence, gentle and age-appropriate.`
}

// --- Verse (Sonnet): one accurate verse from the passage -----------------

export const VERSE_SYSTEM_PROMPT = `You are a careful Bible scholar. Given a children's Bible story, you identify the specific passage the story is based on and return ONE short, real verse that actually appears in that passage.

Rules:
- The verse MUST come from the story's own passage — the specific chapter(s) where these events happen — not a thematically related verse from elsewhere in the Bible.
- Keep the reference accurate (Book Chapter:Verse). You may use kid-friendly translation wording, but the reference must be correct.
- Choose a short, memorable verse suitable for a child.

Output ONLY the verse in exactly this format, nothing else:
"<verse text>" — <Book Chapter:Verse>`

export function buildVersePrompt(description: string, story?: string): string {
  return `A children's bedtime Bible story was just told.

WHAT IT IS ABOUT:
${description}
${story ? `\nTHE STORY AS TOLD:\n${story}\n` : ''}
Give one short, real verse from this story's own passage, with an accurate reference, in the required format.`
}
