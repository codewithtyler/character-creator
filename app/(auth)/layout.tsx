import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - Picasso Creative',
  description: 'Sign in to your account',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      {children}
    </div>
  )
}

