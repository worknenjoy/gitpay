/**
 * Lightweight Whop REST client (fetch-based).
 * Avoids @whop/sdk CJS/ESM issues with jose while remaining nock-friendly in tests.
 */

export type WhopClientOptions = {
  apiKey?: string
  companyId?: string
  baseUrl?: string
}

function getBaseUrl(): string {
  if (process.env.WHOP_API_BASE_URL) return process.env.WHOP_API_BASE_URL.replace(/\/$/, '')
  if (process.env.WHOP_SANDBOX === 'true' || process.env.WHOP_SANDBOX === '1') {
    return 'https://sandbox-api.whop.com/api/v1'
  }
  return 'https://api.whop.com/api/v1'
}

export function getWhopCompanyId(): string {
  return process.env.WHOP_COMPANY_ID || ''
}

export class WhopClient {
  private apiKey: string
  private baseUrl: string
  companyId: string

  constructor(options: WhopClientOptions = {}) {
    this.apiKey = options.apiKey || process.env.WHOP_API_KEY || ''
    this.baseUrl = options.baseUrl || getBaseUrl()
    this.companyId = options.companyId || getWhopCompanyId()
  }

  async request<T = any>(
    method: string,
    path: string,
    body?: Record<string, unknown> | null
  ): Promise<T> {
    if (!this.apiKey && process.env.NODE_ENV !== 'test') {
      throw new Error('WHOP_API_KEY is not configured')
    }

    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    })

    const text = await response.text()
    let data: any = null
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      data = text
    }

    if (!response.ok) {
      const message =
        (data && (data.error?.message || data.message)) ||
        `Whop API ${method} ${path} failed with ${response.status}`
      const err: any = new Error(message)
      err.status = response.status
      err.body = data
      throw err
    }

    return data as T
  }

  post<T = any>(path: string, body?: Record<string, unknown>) {
    return this.request<T>('POST', path, body || {})
  }

  get<T = any>(path: string) {
    return this.request<T>('GET', path)
  }

  patch<T = any>(path: string, body?: Record<string, unknown>) {
    return this.request<T>('PATCH', path, body || {})
  }

  delete<T = any>(path: string) {
    return this.request<T>('DELETE', path)
  }
}

let sharedClient: WhopClient | null = null

export function getWhopClient(): WhopClient {
  if (!sharedClient) {
    sharedClient = new WhopClient()
  }
  return sharedClient
}

export function resetWhopClient(): void {
  sharedClient = null
}
