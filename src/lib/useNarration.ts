'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

export type NarrationState = 'idle' | 'playing' | 'paused'

// Names of pleasant, natural-sounding English voices, best first.
const PREFERRED = [
  'Samantha',
  'Karen',
  'Moira',
  'Serena',
  'Google US English',
  'Google UK English Female',
  'Microsoft Aria',
  'Microsoft Jenny',
  'Daniel',
]

function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  if (voices.length === 0) return undefined
  const en = voices.filter((v) => v.lang.toLowerCase().startsWith('en'))
  const pool = en.length > 0 ? en : voices
  for (const name of PREFERRED) {
    const hit = pool.find((v) => v.name.includes(name))
    if (hit) return hit
  }
  // Prefer a local (higher quality, offline) voice, else the first English one.
  return pool.find((v) => v.localService) ?? pool[0]
}

/**
 * Read text aloud using the browser's built-in speech synthesis.
 * Free, no backend, works offline. Returns null-safe controls; `supported`
 * is false where the API is unavailable (older browsers, SSR, tests).
 */
export function useNarration() {
  const [supported, setSupported] = useState(false)
  const [state, setState] = useState<NarrationState>('idle')
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    setSupported(true)

    const load = () => setVoices(window.speechSynthesis.getVoices())
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load)
      window.speechSynthesis.cancel()
    }
  }, [])

  const play = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window)) return
      window.speechSynthesis.cancel()

      const utter = new SpeechSynthesisUtterance(text)
      utter.rate = 0.92 // a touch slower, for a calm read-aloud
      utter.pitch = 1.0
      const voice = pickVoice(voices.length ? voices : window.speechSynthesis.getVoices())
      if (voice) utter.voice = voice
      utter.onend = () => setState('idle')
      utter.onerror = () => setState('idle')
      utterRef.current = utter
      window.speechSynthesis.speak(utter)
      setState('playing')
    },
    [voices],
  )

  const pause = useCallback(() => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.pause()
    setState('paused')
  }, [])

  const resume = useCallback(() => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.resume()
    setState('playing')
  }, [])

  const stop = useCallback(() => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    setState('idle')
  }, [])

  return { supported, state, play, pause, resume, stop }
}
