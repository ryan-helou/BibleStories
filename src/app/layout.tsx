import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bedtime Bible Stories',
  description: 'Calm, chronological Bible stories to read aloud at bedtime.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto max-w-2xl px-5 py-8">{children}</div>
      </body>
    </html>
  )
}
