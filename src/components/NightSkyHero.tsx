import { type ReactNode } from 'react'

// A hand-built dusk scene: warm horizon glow, a glowing moon, twinkling stars,
// a rare shooting star, layered rolling hills under soft mist, and a little
// village with lit windows — a home at bedtime. This is the page's signature;
// everything else stays quiet around it.

const STARS: { cx: number; cy: number; r: number; delay: number; dur: number }[] = [
  { cx: 70, cy: 60, r: 1.6, delay: 0, dur: 3.2 },
  { cx: 140, cy: 120, r: 1.1, delay: 1.1, dur: 4 },
  { cx: 210, cy: 48, r: 1.8, delay: 0.5, dur: 3.6 },
  { cx: 300, cy: 100, r: 1.2, delay: 2.0, dur: 4.4 },
  { cx: 360, cy: 40, r: 1.5, delay: 0.9, dur: 3.0 },
  { cx: 430, cy: 128, r: 1.0, delay: 1.6, dur: 3.8 },
  { cx: 110, cy: 175, r: 1.3, delay: 2.4, dur: 4.2 },
  { cx: 250, cy: 160, r: 1.1, delay: 0.3, dur: 3.4 },
  { cx: 500, cy: 70, r: 1.7, delay: 1.3, dur: 3.6 },
  { cx: 560, cy: 150, r: 1.2, delay: 0.7, dur: 4.0 },
  { cx: 470, cy: 30, r: 1.0, delay: 2.1, dur: 3.2 },
  { cx: 40, cy: 110, r: 1.2, delay: 1.9, dur: 4.6 },
  { cx: 180, cy: 90, r: 0.9, delay: 0.2, dur: 3.0 },
  { cx: 620, cy: 60, r: 1.4, delay: 1.5, dur: 3.9 },
  { cx: 720, cy: 120, r: 1.2, delay: 0.6, dur: 3.5 },
  { cx: 760, cy: 46, r: 1.0, delay: 2.3, dur: 4.1 },
  { cx: 330, cy: 180, r: 0.9, delay: 1.0, dur: 3.7 },
  { cx: 540, cy: 200, r: 1.0, delay: 1.8, dur: 4.3 },
  { cx: 90, cy: 40, r: 1.0, delay: 0.4, dur: 3.3 },
  { cx: 260, cy: 30, r: 0.8, delay: 2.6, dur: 4.5 },
  { cx: 650, cy: 170, r: 0.9, delay: 1.2, dur: 3.6 },
  { cx: 400, cy: 72, r: 1.1, delay: 0.8, dur: 4.0 },
]

export function NightSkyHero({
  height = 'tall',
  children,
}: {
  height?: 'tall' | 'short'
  children?: ReactNode
}) {
  const h = height === 'tall' ? 'h-64 sm:h-72' : 'h-40 sm:h-44'
  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border border-[var(--line)] shadow-[var(--shadow-card)] ${h}`}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 800 300"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#12153200" />
            <stop offset="0%" stopColor="#141833" />
            <stop offset="42%" stopColor="#2a2b62" />
            <stop offset="70%" stopColor="#5b4a86" />
            <stop offset="88%" stopColor="#a9698a" />
            <stop offset="100%" stopColor="#e0a074" />
          </linearGradient>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe9c2" stopOpacity="0.95" />
            <stop offset="42%" stopColor="#ffd27a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffd27a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="horizon" cx="50%" cy="100%" r="70%">
            <stop offset="0%" stopColor="#f6c496" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f2b98a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c98fa4" stopOpacity="0" />
            <stop offset="100%" stopColor="#c98fa4" stopOpacity="0.22" />
          </linearGradient>
        </defs>

        <rect width="800" height="300" fill="url(#sky)" />
        <rect width="800" height="300" fill="url(#horizon)" />

        {/* stars */}
        {STARS.map((s, i) => (
          <circle
            key={i}
            className="star"
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill="#fff6df"
            style={{ animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s` }}
          />
        ))}

        {/* a rare shooting star */}
        <g className="shoot" style={{ transformOrigin: '700px 40px' }}>
          <line x1="700" y1="40" x2="740" y2="18" stroke="#fff6df" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
          <circle cx="700" cy="40" r="1.8" fill="#fff6df" />
        </g>

        {/* moon */}
        <circle cx="560" cy="74" r="88" fill="url(#moonGlow)" />
        <circle cx="560" cy="74" r="32" fill="#fdf3db" />
        <circle cx="549" cy="65" r="5.5" fill="#efe2bf" opacity="0.7" />
        <circle cx="571" cy="85" r="4.5" fill="#efe2bf" opacity="0.6" />
        <circle cx="574" cy="61" r="3" fill="#efe2bf" opacity="0.6" />

        {/* rolling hills, back to front */}
        <path
          d="M0,215 C150,180 300,205 450,188 C600,172 700,205 800,190 L800,300 L0,300 Z"
          fill="#332e63"
        />
        {/* soft mist settling in the far valley */}
        <path
          d="M0,215 C150,180 300,205 450,188 C600,172 700,205 800,190 L800,250 L0,250 Z"
          fill="url(#mist)"
        />
        <path
          d="M0,242 C120,215 260,242 420,226 C560,212 680,238 800,222 L800,300 L0,300 Z"
          fill="#241f4a"
        />
        <path
          d="M0,270 C160,252 320,274 480,262 C620,251 720,270 800,264 L800,300 L0,300 Z"
          fill="#17142f"
        />

        {/* a little village with warm-lit windows, tucked on the front hill */}
        <g transform="translate(300 236)">
          <path d="M0,14 L16,0 L32,14 Z" fill="#0e0c20" />
          <rect x="2" y="14" width="28" height="22" fill="#100e24" />
          <rect x="11" y="20" width="10" height="9" rx="1" fill="#ffcf7a" />
        </g>
        <g transform="translate(344 244)">
          <path d="M0,10 L11,0 L22,10 Z" fill="#0c0a1c" />
          <rect x="2" y="10" width="18" height="15" fill="#0e0c20" />
          <rect x="8" y="14" width="6" height="6" rx="1" fill="#ffcf7a" opacity="0.85" />
        </g>

        {/* two lone trees on the mid hill */}
        <g transform="translate(470 226)" fill="#0f0d24">
          <rect x="-1.5" y="6" width="3" height="12" />
          <circle cx="0" cy="4" r="9" />
        </g>
        <g transform="translate(150 232)" fill="#0d0b1f">
          <rect x="-1.5" y="5" width="3" height="11" />
          <circle cx="0" cy="3" r="7.5" />
        </g>
      </svg>

      {/* a legibility scrim so overlaid text stays readable over the scene */}
      {children && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#12142e]/80 via-transparent to-transparent" />
      )}

      {children && (
        <div className="relative flex h-full flex-col justify-end p-5 sm:p-6">{children}</div>
      )}
    </div>
  )
}
