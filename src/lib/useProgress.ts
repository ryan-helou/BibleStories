'use client'
import { useCallback, useEffect, useState } from 'react'
import {
  emptyProgress,
  loadProgress,
  markRead as persistRead,
  toggleFavorite as persistFav,
  setLastRead as persistLast,
  type Progress,
} from '@/lib/progress'

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(emptyProgress())

  useEffect(() => setProgress(loadProgress()), [])

  const markRead = useCallback((order: number) => setProgress(persistRead(order)), [])
  const toggleFavorite = useCallback((order: number) => setProgress(persistFav(order)), [])
  const setLastRead = useCallback((order: number) => setProgress(persistLast(order)), [])

  return { progress, markRead, toggleFavorite, setLastRead }
}
