'use client'
import { useEffect, useId, useState } from 'react'
import { useNarration, SLEEP_OPTIONS } from '@/lib/useNarration'
import { VolumeIcon, PlayIcon, PauseIcon, StopIcon } from '@/components/icons'

const SPEEDS = [
  { label: 'Slow', value: 0.75 },
  { label: 'Calm', value: 0.9 },
  { label: 'Normal', value: 1 },
  { label: 'Lively', value: 1.15 },
] as const

const sleepLabel = (m: number) => (m === 0 ? 'Off' : `${m} min`)

const PREVIEW = 'Once upon a time, under a sky full of stars, there was a story just for you.'

/**
 * "Read it to me" control with a voice + speed picker and an optional sleep
 * timer. Speaks `text` aloud with the browser voice. Renders nothing where
 * speech synthesis is unavailable. `resetKey` stops playback whenever it
 * changes (e.g. a new story loads). Set `showSleepTimer={false}` to hide the
 * auto-stop control.
 */
export function NarrationButton({
  text,
  resetKey,
  showSleepTimer = true,
}: {
  text: string
  resetKey?: string
  showSleepTimer?: boolean
}) {
  const {
    supported,
    state,
    play,
    pause,
    resume,
    stop,
    voices,
    voiceURI,
    setVoiceURI,
    rate,
    setRate,
    sleepMinutes,
    setSleepMinutes,
  } = useNarration()
  const [open, setOpen] = useState(false)
  const panelId = useId()

  useEffect(() => {
    stop()
  }, [resetKey, stop])

  if (!supported) return null

  return (
    <div className="flex flex-col items-end gap-3">
      <div className="flex flex-wrap items-center justify-end gap-2">
        {state === 'idle' ? (
          <button type="button" onClick={() => play(text)} className="btn btn-soft text-sm">
            <VolumeIcon size={17} /> Read it to me
          </button>
        ) : (
          <>
            {state === 'playing' ? (
              <button type="button" onClick={pause} className="btn btn-soft text-sm">
                <PauseIcon size={16} /> Pause
              </button>
            ) : (
              <button type="button" onClick={resume} className="btn btn-soft text-sm">
                <PlayIcon size={16} /> Resume
              </button>
            )}
            <button type="button" onClick={stop} className="btn btn-ghost text-sm">
              <StopIcon size={15} /> Stop
            </button>
            {showSleepTimer && sleepMinutes > 0 && (
              <span
                className="text-xs text-[var(--muted)]"
                title={`Narration will stop after ${sleepMinutes} minutes`}
              >
                sleeps in {sleepMinutes} min
              </span>
            )}
          </>
        )}

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          className="btn btn-ghost text-sm"
        >
          Voice
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={open ? 'rotate-180 transition-transform' : 'transition-transform'}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {open && (
        <div id={panelId} className="card w-full max-w-sm p-4 text-left">
          <label htmlFor={`${panelId}-voice`} className="mb-1.5 block text-sm font-semibold">
            Voice
          </label>
          {voices.length > 0 ? (
            <select
              id={`${panelId}-voice`}
              value={voiceURI}
              onChange={(e) => setVoiceURI(e.target.value)}
              className="field mb-4 text-sm"
            >
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="mb-4 text-sm text-[var(--muted)]">Using your device’s default voice.</p>
          )}

          <span className="mb-1.5 block text-sm font-semibold">Speed</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Reading speed">
            {SPEEDS.map((s) => (
              <button
                key={s.label}
                type="button"
                aria-pressed={Math.abs(rate - s.value) < 0.01}
                onClick={() => setRate(s.value)}
                className="opt px-3 py-1.5 text-sm"
              >
                {s.label}
              </button>
            ))}
          </div>

          {showSleepTimer && (
            <div className="mt-4">
              <label
                htmlFor={`${panelId}-sleep`}
                className="mb-1.5 block text-sm font-semibold"
              >
                Sleep timer
              </label>
              <select
                id={`${panelId}-sleep`}
                value={sleepMinutes}
                onChange={(e) => setSleepMinutes(Number(e.target.value))}
                className="field text-sm"
              >
                {SLEEP_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {sleepLabel(m)}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-[var(--muted)]">
                {sleepMinutes === 0
                  ? 'Reads all the way to the end.'
                  : `Gently stops after ${sleepMinutes} minutes.`}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => play(PREVIEW)}
            className="btn btn-ghost mt-4 text-sm"
          >
            <VolumeIcon size={16} /> Preview this voice
          </button>
        </div>
      )}
    </div>
  )
}
