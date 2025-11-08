'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const router = useRouter()
  const [isBypass, setIsBypass] = useState(false)

  useEffect(() => {
    // Check if using dev bypass token
    const checkBypass = async () => {
      try {
        const response = await fetch('/api/auth/check-bypass')
        if (response.ok) {
          const data = await response.json()
          setIsBypass(data.isBypass || false)
        }
      } catch {
        // Ignore errors
      }
    }
    checkBypass()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-2xl font-bold text-white">
              Picasso Creative
            </Link>
            <div className="hidden md:flex gap-4">
              <Link
                href="/dashboard"
                className="text-purple-200 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/character-creator"
                className="text-purple-200 hover:text-white transition-colors"
              >
                Character Creator
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isBypass && (
              <span className="text-xs text-yellow-300 bg-yellow-500/20 px-2 py-1 rounded">
                Dev Bypass
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-purple-200 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

