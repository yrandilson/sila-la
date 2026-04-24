import { timingSafeEqual } from 'crypto'
import { NextRequest } from 'next/server'
import { env } from '@/lib/env'

function parseToken(req: NextRequest): string {
  const explicit = req.headers.get('x-admin-token')
  if (explicit) return explicit

  const authHeader = req.headers.get('authorization') || ''
  if (authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim()
  }

  return ''
}

function safeCompare(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a)
  const bBuffer = Buffer.from(b)

  if (aBuffer.length !== bBuffer.length) {
    return false
  }

  return timingSafeEqual(aBuffer, bBuffer)
}

export function isAdminAuthorized(req: NextRequest): boolean {
  const configuredToken = env.ADMIN_PANEL_TOKEN
  if (!configuredToken) {
    return false
  }

  const providedToken = parseToken(req)
  if (!providedToken) {
    return false
  }

  return safeCompare(providedToken, configuredToken)
}
