import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Picasso Creative - AI Content Creation Platform',
  description: 'Create consistent characters, generate images, and automate your content workflow',
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

