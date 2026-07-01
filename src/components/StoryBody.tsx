export function StoryBody({ body }: { body: string }) {
  const paragraphs = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  return (
    <div className="text-xl leading-loose">
      {paragraphs.map((p, i) => (
        <p key={i} className="mb-5">
          {p}
        </p>
      ))}
    </div>
  )
}
