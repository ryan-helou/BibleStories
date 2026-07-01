export function StoryBody({ body, dropcap = false }: { body: string; dropcap?: boolean }) {
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
  return (
    <div className="text-xl leading-loose">
      {paragraphs.map((p, i) => (
        <p key={i} className={`mb-5 ${dropcap && i === 0 ? 'dropcap' : ''}`}>
          {p}
        </p>
      ))}
    </div>
  )
}
