'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

export type NarrationState = 'idle' | 'playing' | 'paused'

// Warm, natural-sounding English voices, best first. Storyteller vibe: we lean
// toward gentle female voices that read well at bedtime.
const PREFERRED = [
  'Ava',
  'Samantha',
  'Serena',
  'Zoe',
  'Allison',
  'Karen',
  'Moira',
  'Google US English',
  'Google UK English Female',
  'Microsoft Aria',
  'Microsoft Jenny',
  'Daniel',
]

// Markers browsers use for their higher-quality (neural / cloud) voices.
const PREMIUM = /(natural|neural|premium|enhanced|siri)/i

// Score a voice so we pick the nicest one available on this device.
function scoreVoice(v: SpeechSynthesisVoice): number {
  const name = v.name
  let s = 0
  if (PREMIUM.test(name)) s += 100
  const idx = PREFERRED.findIndex((p) => name.includes(p))
  if (idx >= 0) s += 60 - idx
  if (/google/i.test(name)) s += 20
  if (v.localService) s += 10 // offline Apple voices are usually clean
  if (v.lang.toLowerCase().startsWith('en-us')) s += 5
  return s
}

function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  if (voices.length === 0) return undefined
  const en = voices.filter((v) => v.lang.toLowerCase().startsWith('en'))
  const pool = en.length > 0 ? en : voices
  return pool.reduce((best, v) => (scoreVoice(v) > scoreVoice(best) ? v : best), pool[0])
}

// Split narration into short, sentence-aligned chunks. This does two things:
//  1) sidesteps Chrome's long-utterance cutoff (~15s / a few hundred chars), and
//  2) gives a calmer, storyteller cadence — a small breath between chunks.
const MAX_CHUNK = 180
export function splitIntoChunks(text: string): string[] {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (!clean) return []
  const sentences = clean.match(/[^.!?…]+[.!?…]*\s*/g) ?? [clean]
  const chunks: string[] = []
  let buf = ''
  for (const raw of sentences) {
    const s = raw.trim()
    if (!s) continue
    if (buf && (buf.length + s.length + 1 > MAX_CHUNK)) {
      chunks.push(buf)
      buf = s
    } else {
      buf = buf ? `${buf} ${s}` : s
    }
  }
  if (buf) chunks.push(buf)
  return chunks
}

/**
 * Read text aloud using the browser's built-in speech synthesis.
 * Free, no backend, works offline. Returns null-safe controls; `supported`
 * is false where the API is unavailable (older browsers, SSR, tests).
 *
 * Text is played back one short chunk at a time so long stories don't get cut
 * off mid-read, and so the pacing feels like a gentle bedtime read-aloud.
 */
export function useNarration() {
  const [supported, setSupported] = useState(false)
  const [state, setState] = useState<NarrationState>('idle')
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  // Playback session state, kept in refs so the chunk queue survives re-renders.
  const chunksRef = useRef<string[]>([])
  const idxRef = useRef(0)
  const tokenRef = useRef(0) // bumped to invalidate an in-flight queue on stop/replay

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

  // Speak the next queued chunk, unless this session has been superseded.
  const speakNext = useCallback(
    (token: number, voice?: SpeechSynthesisVoice) => {
      if (token !== tokenRef.current) return
      if (idxRef.current >= chunksRef.current.length) {
        setState('idle')
        return
      }
      const utter = new SpeechSynthesisUtterance(chunksRef.current[idxRef.current])
      utter.rate = 0.9 // a touch slower, for a calm read-aloud
      utter.pitch = 1.02 // a hair warmer
      if (voice) utter.voice = voice
      utter.onend = () => {
        if (token !== tokenRef.current) return // cancelled — don't advance
        idxRef.current += 1
        speakNext(token, voice)
      }
      utter.onerror = () => {
        if (token !== tokenRef.current) return
        idxRef.current += 1
        speakNext(token, voice)
      }
      window.speechSynthesis.speak(utter)
    },
    [],
  )

  const play = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window)) return
      window.speechSynthesis.cancel()

      const chunks = splitIntoChunks(text)
      if (chunks.length === 0) return
      const voice = pickVoice(voices.length ? voices : window.speechSynthesis.getVoices())

      chunksRef.current = chunks
      idxRef.current = 0
      tokenRef.current += 1
      setState('playing')
      speakNext(tokenRef.current, voice)
    },
    [voices, speakNext],
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
    tokenRef.current += 1 // invalidate the queue so onend won't advance it
    window.speechSynthesis.cancel()
    setState('idle')
  }, [])

  return { supported, state, play, pause, resume, stop }
}
