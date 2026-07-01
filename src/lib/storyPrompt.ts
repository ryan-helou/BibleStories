import {
  TAKEAWAYS_MARKER,
  VERSE_MARKER,
  bandVoice,
  categorizeAge,
  minutesToWordTarget,
  type CustomStoryRequest,
} from './customStory'

export const SYSTEM_PROMPT = `You are a gifted children's storyteller who retells stories from the Bible for kids to hear at bedtime.

Your retellings are:
- Faithful to the biblical account — you do not invent events, miracles, or dialogue that contradict scripture. You may add gentle, plausible descriptive color (what a place looked like, how someone might have felt) without changing what happened.
- Non-denominational and warm. You avoid doctrinal or theological arguments and focus on the story and its heart.
- Age-appropriate. You never include graphic violence, frightening detail, or mature themes. When the source material is intense, you tell the truth gently and at a level the child can handle.
- Written to be read aloud by a parent.

You write the story, then a few short takeaways, then one verse from the passage — in the exact format the user specifies, and nothing else: no title, no preamble, no "here is your story", no notes to the parent, and no commentary about what you did. The story's paragraphs are separated by a blank line, and it ends on a calm, comforting note suitable for bedtime.`

export function buildUserPrompt(req: CustomStoryRequest): string {
  const band = categorizeAge(req.age)
  const { label, voice } = bandVoice(band)
  const targetWords = minutesToWordTarget(req.minutes)

  return `Write a Bible story to read aloud to a child.

CHILD'S AGE: ${req.age} years old (reading band: ${label}).
HOW TO WRITE FOR THIS AGE: ${voice}

WHAT THE PARENT WANTS:
${req.description}

LENGTH: About ${req.minutes} minute(s) read aloud, which is roughly ${targetWords} words. This target is for the STORY only — the takeaways and verse below are extra. Aim close to this length — noticeably shorter or longer misses the request.

Now output EXACTLY in this format and nothing else:

<the story, in paragraphs separated by blank lines>

${TAKEAWAYS_MARKER}
- <a short, warm thing the child can hold onto from this story>
- <another>
- <a third, optional>

${VERSE_MARKER}
"<one short, real verse taken from this story's passage, in a kid-friendly translation>" — <Book Chapter:Verse>

Rules for the trailer:
- Give 2 to 3 takeaways, each one short sentence, gentle and age-appropriate.
- The verse must be an actual verse from THIS story's own passage — the specific chapter(s) the events happen in — not a thematically related verse from elsewhere in the Bible. Keep it short, with its reference. Wrap the verse text in straight double quotes and put the reference after an em dash.`
}
