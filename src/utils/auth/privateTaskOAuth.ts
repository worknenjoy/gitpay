import jwt from 'jsonwebtoken'

export type PrivateTaskStatePayload = {
  userId: number
  url: string
}

const privateTaskOAuthSecret = () => {
  const secret = process.env.SECRET_PHRASE || process.env.GITHUB_SECRET
  if (!secret) {
    throw new Error('missing_private_task_oauth_secret')
  }
  return secret
}

export function createPrivateTaskState(payload: PrivateTaskStatePayload): string {
  return jwt.sign(payload, privateTaskOAuthSecret(), {
    audience: 'private-task-import',
    expiresIn: '10m',
    issuer: 'gitpay'
  })
}

export function verifyPrivateTaskState(state: unknown): PrivateTaskStatePayload | null {
  if (typeof state !== 'string' || !state) {
    return null
  }

  try {
    const payload = jwt.verify(state, privateTaskOAuthSecret(), {
      audience: 'private-task-import',
      issuer: 'gitpay'
    })

    if (typeof payload !== 'object' || payload === null) {
      return null
    }

    const { userId, url } = payload as Record<string, unknown>
    if (typeof userId !== 'number' || !Number.isInteger(userId) || userId <= 0) {
      return null
    }
    const parsedUrl = typeof url === 'string' ? new URL(url) : null
    if (parsedUrl?.protocol !== 'https:' || parsedUrl.hostname !== 'github.com') {
      return null
    }

    return { userId, url: parsedUrl.href }
  } catch {
    return null
  }
}

type GithubIdentity = {
  id?: number | string | null
  login?: string | null
  email?: string | null
}

type GitpayIdentity = {
  provider_id?: string | number | null
  provider_username?: string | null
  provider_email?: string | null
  email?: string | null
}

export function isLinkedGithubAccount(
  user: GitpayIdentity | null,
  githubUser: GithubIdentity | null
): boolean {
  if (!user || !githubUser?.id) {
    return false
  }

  if (user.provider_id) {
    return String(user.provider_id) === String(githubUser.id)
  }

  if (user.provider_username && githubUser.login) {
    return user.provider_username.toLowerCase() === githubUser.login.toLowerCase()
  }

  const githubEmail = githubUser.email?.toLowerCase()
  const user_email = user.provider_email?.toLowerCase() || user.email?.toLowerCase()
  return Boolean(githubEmail && user_email && githubEmail === user_email)
}
