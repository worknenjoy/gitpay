export const validAccount = (user, account) => {
  if (!user?.account_id) return false
  if (account?.data?.requirements?.disabled_reason?.startsWith('rejected')) return false
  if (account?.data?.requirements?.currently_due?.length > 0) return false
  return true
}
