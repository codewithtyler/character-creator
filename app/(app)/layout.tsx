import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getToken, deleteToken, isTokenValid } from '@/lib/auth/token'
import Navbar from '@/components/Navbar'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const tokenData = await getToken(cookieStore)

  if (!tokenData) {
    redirect('/login')
  }

  if (!isTokenValid(tokenData)) {
    await deleteToken(cookieStore)
    redirect('/login')
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 min-h-0 overflow-hidden">{children}</main>
    </div>
  )
}

