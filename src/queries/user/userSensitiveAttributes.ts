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
