import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Scene Builder - AI 360° Scene Generator',
  description: 'Generate and view AI scenes from all angles',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

