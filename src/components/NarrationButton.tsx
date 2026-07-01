'use client'
import { useEffect } from 'react'
import { useNarration } from '@/lib/useNarration'

/**
 * "Read it to me" control. Speaks `text` aloud with the browser voice.
 * Renders nothing where speech synthesis is unavailable.
 * `resetKey` stops playback whenever it changes (e.g. a new story loads).
 */
export function NarrationButton({ text, resetKey }: { text: string; resetKey?: string }) {
  const { supported, state, play, pause, resume, stop } = useNarration()

  useEffect(() => {
    stop()
  }, [resetKey, stop])

  if (!supported) return null

  const base =
    'lamplight inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold'

  if (state === 'idle') {
    return (
      <button
        type="button"
        onClick={() => play(text)}
        className={`${base} border-[var(--accent)] bg-[var(--surface-2)] text-[var(--accent)]`}
      >
        🔊 Read it to me
      </button>
    )
  }

  return (
    <div className="inline-flex items-center gap-2">
      {state === 'playing' ? (
        <button
          type="button"
          onClick={pause}
          className={`${base} border-[var(--accent)] bg-[var(--surface-2)] text-[var(--accent)]`}
        >
          ⏸ Pause
        </button>
      ) : (
        <button
          type="button"
          onClick={resume}
          className={`${base} border-[var(--accent)] bg-[var(--surface-2)] text-[var(--accent)]`}
        >
          ▶ Resume
        </button>
      )}
      <button
        type="button"
        onClick={stop}
        className={`${base} border-[var(--line)] bg-[var(--surface)] text-[var(--muted)]`}
      >
        ⏹ Stop
      </button>
    </div>
  )
}
