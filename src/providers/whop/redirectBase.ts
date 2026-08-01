/**
 * Public https origin for Whop browser redirects (checkout return, account links).
 * Whop rejects non-https URLs.
 *
 * Prefer WHOP_API_HOST (ngrok → API :3000). Backend then bounces to FRONTEND_HOST.
 */
export function getWhopHttpsApiBaseUrl(): string | null {
  const candidates = [
    process.env.WHOP_API_HOST,
    process.env.WHOP_FRONTEND_HOST, // legacy alias
    process.env.API_HOST
  ]

  for (const raw of candidates) {
    if (!raw) continue
    const trimmed = String(raw).trim().replace(/\/$/, '')
    if (!trimmed) continue
    if (trimmed.startsWith('https://')) return trimmed
    // Only auto-upgrade hostnames that are already public (not localhost)
    if (trimmed.startsWith('http://')) {
      const withoutProto = trimmed.slice('http://'.length)
      if (
        withoutProto.startsWith('localhost') ||
        withoutProto.startsWith('127.0.0.1')
      ) {
        continue
      }
      return `https://${withoutProto}`
    }
    // bare host
    if (!trimmed.includes('localhost') && !trimmed.startsWith('127.0.0.1')) {
      return `https://${trimmed}`
    }
  }

  return null
}

/** FRONTEND_HOST for post-checkout SPA bounce (may be http://localhost). */
export function getFrontendHostBase(): string {
  return (process.env.FRONTEND_HOST || 'http://localhost:8082').replace(/\/$/, '')
}
