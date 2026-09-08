export const USER_AUTH_SECRET_ATTRIBUTES = [
  'password',
  'recover_password_token',
  'recover_password_token_expires_at',
  'activation_token',
  'activation_token_expires_at',
  'email_change_token',
  'email_change_token_expires_at',
  'pending_email_change'
]

export const USER_SENSITIVE_ATTRIBUTES = [
  ...USER_AUTH_SECRET_ATTRIBUTES,
  'paypal_id',
  'customer_id',
  'account_id',
  'whop_account_id'
]

// For self-facing responses built from Model.update(..., { returning: true }): Sequelize's
// RETURNING clause ignores scopes (always `RETURNING *`), so the selfView DB scope can't
// protect these -- this strips auth secrets from the plain result at the JS level instead.
// `keep` carves out a field the caller is actively meant to receive (e.g. activation_token
// right after register, so the client can drive /auth/activate).
export const omitAuthSecrets = (userData: any, keep: string[] = []) => {
  if (!userData) return userData
  const plain = userData.dataValues ? { ...userData.dataValues } : { ...userData }
  USER_AUTH_SECRET_ATTRIBUTES.filter((field) => !keep.includes(field)).forEach(
    (field) => delete plain[field]
  )
  return plain
}
