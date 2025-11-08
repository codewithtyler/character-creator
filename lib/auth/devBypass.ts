import { cookies } from 'next/headers'
import { setToken } from './token'

export async function createDevBypassToken(): Promise<void> {
  const cookieStore = await cookies()
  // Create a mock token for development bypass
  const mockToken = 'dev-bypass-token-' + Date.now()
  await setToken(cookieStore, mockToken)
}

