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

export const publicUserInclude = (UserModel: unknown, as?: string) => ({
  model: UserModel,
  ...(as ? { as } : {}),
  attributes: { exclude: [...USER_SECRET_ATTRIBUTES] }
})
