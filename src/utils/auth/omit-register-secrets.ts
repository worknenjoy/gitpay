// Fields that must never go out on register/activate JSON. activation_token stays:
// the client needs it to confirm the account.
const OMITTED = new Set([
  'password',
  'paypal_id',
  'customer_id',
  'account_id',
  'whop_account_id',
  'recover_password_token',
  'email_change_token',
  'pending_email_change'
])

const isSequelizeInstance = (value: unknown): value is { get: (options: { plain: boolean }) => unknown; dataValues?: unknown } => {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as { get?: unknown }).get === 'function' &&
    !!(value as { dataValues?: unknown }).dataValues
  )
}

export function omitRegisterSecrets<T>(value: T): T {
  if (value == null || typeof value !== 'object') return value
  const source = isSequelizeInstance(value) ? value.get({ plain: true }) : value
  if (source == null || typeof source !== 'object' || Array.isArray(source)) {
    return source as T
  }
  const out: Record<string, unknown> = {}
  for (const [key, nested] of Object.entries(source as Record<string, unknown>)) {
    if (OMITTED.has(key)) continue
    out[key] = nested
  }
  return out as T
}
