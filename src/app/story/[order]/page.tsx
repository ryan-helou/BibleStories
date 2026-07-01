import { notFound } from 'next/navigation'
import { getAllStories, getStoryByOrder, getAdjacent } from '@/content/library'
import { StoryReader } from './StoryReader'

export function generateStaticParams() {
  return getAllStories().map((s) => ({ order: String(s.order) }))
}

export default async function StoryPage({ params }: { params: Promise<{ order: string }> }) {
  const { order } = await params
  const story = getStoryByOrder(Number(order))
  if (!story) notFound()
  const { prev, next } = getAdjacent(story.order)
  return (
    <StoryReader
      story={story}
      prevOrder={prev?.order ?? null}
      nextOrder={next?.order ?? null}
    />
  )
}
