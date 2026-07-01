import type { Metadata } from 'next'
import './globals.css'
import { MoonIcon } from '@/components/icons'

export const metadata: Metadata = {
  title: 'Bedtime Bible Stories',
  description: 'Calm, cozy Bible stories to read aloud at bedtime.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Fonts load browser-side (non-blocking) with rounded system fallbacks,
            so the server never depends on a font fetch. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Nunito:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Night-sky backdrop: a slow aurora, a warm moon-glow + a scatter of stars */}
        <div className="aurora" aria-hidden="true" />
        <div className="sky" aria-hidden="true" />
        {/* Full-width shell; each page picks its own max width (landing goes
            wide, reading pages stay a cozy max-w-2xl for comfortable line length). */}
        <div className="px-5 py-8">{children}</div>
        <footer className="mx-auto flex max-w-5xl items-center justify-center gap-2 px-5 pb-10 pt-4 text-center text-sm text-[var(--faint)]">
          <MoonIcon size={14} /> Bedtime Bible Stories — read aloud, tucked in, and loved.
        </footer>
      </body>
    </html>
  )
}
