'use client'
import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_AGE_BAND, isAgeBand } from '@/content/ageBands'
import type { AgeBand } from '@/content/schema'

const KEY = 'biblestories.ageBand'

export function useAgeBand() {
  const [ageBand, setBand] = useState<AgeBand>(DEFAULT_AGE_BAND)

  useEffect(() => {
    const stored = localStorage.getItem(KEY)
    if (isAgeBand(stored)) setBand(stored)
  }, [])

  const setAgeBand = useCallback((band: AgeBand) => {
    setBand(band)
    localStorage.setItem(KEY, band)
  }, [])

  return { ageBand, setAgeBand }
}
