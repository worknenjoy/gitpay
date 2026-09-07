export const USER_SECRET_ATTRIBUTES = [
  'password',
  'recover_password_token',
  'activation_token',
  'email_change_token',
  'paypal_id',
  'customer_id',
  'account_id',
  'whop_account_id',
  'pending_email_change'
] as const

const SECRET_KEYS = new Set<string>(USER_SECRET_ATTRIBUTES)

export const publicUserInclude = (UserModel: unknown) => ({
  model: UserModel,
  attributes: { exclude: [...USER_SECRET_ATTRIBUTES] }
})

const isSequelizeInstance = (value: unknown): value is { get: (options: { plain: boolean }) => unknown } => {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as { get?: unknown }).get === 'function' &&
    !!(value as { dataValues?: unknown }).dataValues
  )
}

export function stripUserSecrets<T>(value: T, seen: WeakSet<object> = new WeakSet()): T {
  if (value == null || typeof value !== 'object') return value
  if (value instanceof Date) return value
  if (seen.has(value as object)) return undefined as T
  seen.add(value as object)

  if (Array.isArray(value)) {
    return value.map((item) => stripUserSecrets(item, seen)) as T
  }

  const source = isSequelizeInstance(value) ? value.get({ plain: true }) : value
  if (source == null || typeof source !== 'object') return source as T

  if (Array.isArray(source)) {
    return source.map((item) => stripUserSecrets(item, seen)) as T
  }

  const out: Record<string, unknown> = {}
  for (const [key, nested] of Object.entries(source as Record<string, unknown>)) {
    if (SECRET_KEYS.has(key)) continue
    out[key] = stripUserSecrets(nested, seen)
  }
  return out as T
}
