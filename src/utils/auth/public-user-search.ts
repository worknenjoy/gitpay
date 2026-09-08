export const PUBLIC_USER_ATTRIBUTES = [
  'id',
  'website',
  'profile_url',
  'picture_url',
  'name',
  'username',
  'provider',
  'repos',
  'createdAt',
  'updatedAt'
] as const

// Reset-password looks up a user by token and shows email in the form copy.
const RESET_LOOKUP_ATTRIBUTES = [...PUBLIC_USER_ATTRIBUTES, 'email'] as const

export const ALLOWED_USER_SEARCH_FILTERS = ['id', 'username', 'recover_password_token'] as const

export function publicUserSearchWhere(query: Record<string, unknown> | null | undefined) {
  const where: Record<string, unknown> = {}
  if (!query || typeof query !== 'object') return where
  for (const key of ALLOWED_USER_SEARCH_FILTERS) {
    const value = query[key]
    if (value !== undefined && value !== null && value !== '') {
      where[key] = value
    }
  }
  return where
}

export function publicUserSearchAttributes(where: Record<string, unknown>) {
  if (where.recover_password_token) {
    return [...RESET_LOOKUP_ATTRIBUTES]
  }
  return [...PUBLIC_USER_ATTRIBUTES]
}
