import type { Metadata } from 'next'
import './globals.css'

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
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Night-sky backdrop: warm moon-glow + a scatter of stars */}
        <div className="sky" aria-hidden="true" />
        <div className="mx-auto max-w-2xl px-5 py-8">{children}</div>
      </body>
    </html>
  )
}
