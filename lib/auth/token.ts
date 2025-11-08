import { cookies } from 'next/headers'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

const TOKEN_COOKIE_NAME = 'auth_token'
const EXPIRATION_COOKIE_NAME = 'auth_token_expires'
const TOKEN_DURATION_DAYS = 21

export interface TokenData {
  token: string
  expiresAt: number
}

export async function getToken(
  cookieStore: ReadonlyRequestCookies
): Promise<TokenData | null> {
  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value
  const expiresStr = cookieStore.get(EXPIRATION_COOKIE_NAME)?.value

  if (!token || !expiresStr) {
    return null
  }

  const expiresAt = parseInt(expiresStr, 10)
  return { token, expiresAt }
}

export async function setToken(
  cookieStore: ReadonlyRequestCookies,
  token: string
): Promise<void> {
  const expiresAt = Date.now() + TOKEN_DURATION_DAYS * 24 * 60 * 60 * 1000

  cookieStore.set(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_DURATION_DAYS * 24 * 60 * 60,
    path: '/',
  })

  cookieStore.set(EXPIRATION_COOKIE_NAME, expiresAt.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_DURATION_DAYS * 24 * 60 * 60,
    path: '/',
  })
}

export async function deleteToken(
  cookieStore: ReadonlyRequestCookies
): Promise<void> {
  cookieStore.delete(TOKEN_COOKIE_NAME)
  cookieStore.delete(EXPIRATION_COOKIE_NAME)
}

export function isTokenValid(tokenData: TokenData | null): boolean {
  if (!tokenData) {
    return false
  }

  return Date.now() < tokenData.expiresAt
}

