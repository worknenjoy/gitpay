import crypto from 'crypto'

const PRIVATE_TASK_STATE_TTL_MS = 10 * 60 * 1000

export interface PrivateTaskOAuthState {
  userId: number
  url: string
}

interface SignedStatePayload extends PrivateTaskOAuthState {
  nonce: string
  exp: number
}

const getSigningSecret = (): string => {
  const secret = process.env.SECRET_PHRASE
  if (!secret) {
    throw new Error('Missing SECRET_PHRASE environment variable')
  }
  return secret
}

const toBase64Url = (input: Buffer | string): string => {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

const fromBase64Url = (input: string): string => {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4))
  return Buffer.from(`${normalized}${padding}`, 'base64').toString('utf8')
}

export const signPrivateTaskState = ({ userId, url }: PrivateTaskOAuthState): string => {
  const numericUserId = Number(userId)
  if (!Number.isInteger(numericUserId) || numericUserId <= 0) {
    throw new Error('Invalid user id for private task state')
  }
  if (!url || typeof url !== 'string') {
    throw new Error('Invalid url for private task state')
  }

  const payload: SignedStatePayload = {
    userId: numericUserId,
    url,
    nonce: crypto.randomBytes(16).toString('hex'),
    exp: Date.now() + PRIVATE_TASK_STATE_TTL_MS
  }

  const encodedPayload = toBase64Url(JSON.stringify(payload))
  const signature = toBase64Url(
    crypto.createHmac('sha256', getSigningSecret()).update(encodedPayload).digest()
  )
  return `${encodedPayload}.${signature}`
}

export const verifyPrivateTaskState = (state: unknown): PrivateTaskOAuthState | null => {
  if (typeof state !== 'string' || !state) {
    return null
  }

  const parts = state.split('.')
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return null
  }

  const [encodedPayload, providedSignature] = parts
  try {
    const expectedSignature = toBase64Url(
      crypto.createHmac('sha256', getSigningSecret()).update(encodedPayload).digest()
    )
    const providedBuf = Buffer.from(providedSignature, 'utf8')
    const expectedBuf = Buffer.from(expectedSignature, 'utf8')
    if (
      providedBuf.length !== expectedBuf.length ||
      !crypto.timingSafeEqual(providedBuf, expectedBuf)
    ) {
      return null
    }

    const parsed = JSON.parse(fromBase64Url(encodedPayload)) as Partial<SignedStatePayload>
    if (
      !parsed ||
      !Number.isInteger(parsed.userId) ||
      (parsed.userId as number) <= 0 ||
      typeof parsed.url !== 'string' ||
      !parsed.url ||
      typeof parsed.exp !== 'number' ||
      parsed.exp <= Date.now()
    ) {
      return null
    }

    return {
      userId: parsed.userId as number,
      url: parsed.url
    }
  } catch (_error) {
    return null
  }
}
