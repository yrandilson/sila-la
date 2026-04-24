const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isUuid(value: string): boolean {
  return UUID_REGEX.test(value)
}

export function isSafeSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}

export function normalizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) {
    return []
  }

  return tags
    .filter((tag): tag is string => typeof tag === 'string')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 15)
}

export function parsePriceInCents(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    if (value < 100 || value > 100000000) return null
    return Math.round(value)
  }

  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.replace('.', '').replace(',', '.').trim()
  const parsed = Number.parseFloat(normalized)
  if (!Number.isFinite(parsed)) {
    return null
  }

  const cents = Math.round(parsed * 100)
  if (cents < 100 || cents > 100000000) {
    return null
  }

  return cents
}
