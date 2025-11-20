export const validAccount = (user, account) => {
  if (!user?.account_id) {
    return false
  } else if (account?.data?.requirements?.currently_due?.length > 0) {
    return false
  } else {
    return true
  }
}
