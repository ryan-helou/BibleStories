import {
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

You write ONLY the story itself. No title, no preamble, no headings, no "here is your story", no notes to the parent, and no commentary about what you did. Separate paragraphs with a blank line. End on a calm, comforting note suitable for bedtime.`

export function buildUserPrompt(req: CustomStoryRequest): string {
  const band = categorizeAge(req.age)
  const { label, voice } = bandVoice(band)
  const targetWords = minutesToWordTarget(req.minutes)

  return `Write a Bible story to read aloud to a child.

CHILD'S AGE: ${req.age} years old (reading band: ${label}).
HOW TO WRITE FOR THIS AGE: ${voice}

WHAT THE PARENT WANTS:
${req.description}

LENGTH: About ${req.minutes} minute(s) read aloud, which is roughly ${targetWords} words. Aim close to this length — noticeably shorter or longer misses the request.

Write the story now, following all of the above. Remember: output only the story text, in paragraphs separated by blank lines.`
}
