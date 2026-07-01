import type { SVGProps } from 'react'

// A small set of thin, hand-drawn line icons. We use these instead of emoji so
// the interface reads as intentionally designed rather than assembled — one
// consistent stroke weight, one visual language, tuned to the dusk palette.

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function base({ size = 20, strokeWidth = 1.6, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...props,
  }
}

export function MoonIcon(p: IconProps) {
  return (
    <svg {...base(p)} aria-hidden="true">
      <path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a6.6 6.6 0 0 0 10.7 10.7Z" />
    </svg>
  )
}

export function BookIcon(p: IconProps) {
  return (
    <svg {...base(p)} aria-hidden="true">
      <path d="M12 6.5C10.4 5.2 7.8 4.6 5 4.6v13c2.8 0 5.4.6 7 1.9 1.6-1.3 4.2-1.9 7-1.9v-13c-2.8 0-5.4.6-7 1.9Z" />
      <path d="M12 6.5V19" />
    </svg>
  )
}

export function ClockIcon(p: IconProps) {
  return (
    <svg {...base(p)} aria-hidden="true">
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.6V12l3 1.8" />
    </svg>
  )
}

export function CompassIcon(p: IconProps) {
  return (
    <svg {...base(p)} aria-hidden="true">
      <circle cx="12" cy="12" r="8.2" />
      <path d="M15.4 8.6 13.4 13.4 8.6 15.4 10.6 10.6Z" />
    </svg>
  )
}

export function ChildIcon(p: IconProps) {
  return (
    <svg {...base(p)} aria-hidden="true">
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  )
}

export function FeatherIcon(p: IconProps) {
  return (
    <svg {...base(p)} aria-hidden="true">
      <path d="M19.5 5A8.4 8.4 0 0 0 7.6 5L5.4 16.6 4 20l3.4-1.4A8.4 8.4 0 0 0 19.5 5Z" />
      <path d="M7.4 18.6 14 12" />
    </svg>
  )
}

export function VolumeIcon(p: IconProps) {
  return (
    <svg {...base(p)} aria-hidden="true">
      <path d="M4 9.5v5h3.2L12 18.5v-13L7.2 9.5Z" />
      <path d="M15.5 9a4 4 0 0 1 0 6" />
    </svg>
  )
}

export function SparkleIcon(p: IconProps) {
  return (
    <svg {...base(p)} aria-hidden="true">
      <path d="M12 3.5c.5 3.6 1.9 5 5.5 5.5-3.6.5-5 1.9-5.5 5.5-.5-3.6-1.9-5-5.5-5.5 3.6-.5 5-1.9 5.5-5.5Z" />
      <path d="M18.5 14.5c.2 1.5.8 2.1 2.3 2.3-1.5.2-2.1.8-2.3 2.3-.2-1.5-.8-2.1-2.3-2.3 1.5-.2 2.1-.8 2.3-2.3Z" />
    </svg>
  )
}

export function PencilIcon(p: IconProps) {
  return (
    <svg {...base(p)} aria-hidden="true">
      <path d="M15.2 5.4 18.6 8.8M4.5 19.5l1-3.7L15 6.3a1.8 1.8 0 0 1 2.6 0l.1.1a1.8 1.8 0 0 1 0 2.6L8.2 18.5Z" />
    </svg>
  )
}

export function StarIcon({ filled = false, ...p }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(p)} fill={filled ? 'currentColor' : 'none'} aria-hidden="true">
      <path d="M12 4.2l2.3 4.9 5.3.6-4 3.7 1.1 5.2L12 16l-4.7 2.6 1.1-5.2-4-3.7 5.3-.6Z" />
    </svg>
  )
}

export function PlayIcon(p: IconProps) {
  return (
    <svg {...base(p)} aria-hidden="true">
      <path d="M7.5 5.5 18 12l-10.5 6.5Z" />
    </svg>
  )
}

export function PauseIcon(p: IconProps) {
  return (
    <svg {...base(p)} aria-hidden="true">
      <path d="M8.5 5.5v13M15.5 5.5v13" />
    </svg>
  )
}

export function StopIcon(p: IconProps) {
  return (
    <svg {...base(p)} aria-hidden="true">
      <rect x="6.5" y="6.5" width="11" height="11" rx="2" />
    </svg>
  )
}

export function ArrowRightIcon(p: IconProps) {
  return (
    <svg {...base(p)} aria-hidden="true">
      <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
    </svg>
  )
}
