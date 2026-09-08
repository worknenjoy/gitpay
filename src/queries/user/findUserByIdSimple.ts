import Models from '../../models'

const models = Models as any

// Every current caller is internal payment-provider/account plumbing (Stripe/Whop
// account & customer IDs, bank accounts, transfers) -- never a direct API response --
// so this always resolves the full row rather than making each caller opt in.
export const findUserByIdSimple = async (id: number, options: any = {}) => {
  return models.User.scope('withSensitive').findByPk(id, options)
}
