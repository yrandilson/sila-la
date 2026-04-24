function optionalEnv(name: string, fallback = ''): string {
  const value = process.env[name]
  if (!value || !value.trim()) {
    return fallback
  }
  return value
}

function getSiteUrl(): string {
  const configured = optionalEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000')
  return configured.replace(/\/$/, '')
}

export const env = {
  NEXT_PUBLIC_SITE_URL: getSiteUrl(),
  ADMIN_PANEL_TOKEN: optionalEnv('ADMIN_PANEL_TOKEN'),
}
