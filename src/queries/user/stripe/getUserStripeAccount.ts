import { findUserByIdSimple } from '../findUserByIdSimple'
import { retrieveAccount } from '../../provider/stripe/account'

export const getUserStripeAccount = async (userId: number) => {
  const user = await findUserByIdSimple(userId)
  const accountId = user?.dataValues?.account_id

  if (!accountId) return {}

  try {
    return await retrieveAccount(accountId)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('could not find customer', e)
    return e
  }
}
