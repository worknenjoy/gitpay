import { Op } from 'sequelize'
import { findUser } from './findUser'

type ProviderUserParams = {
  provider?: string
  provider_id?: string
  provider_username?: string
  provider_email?: string
}

export const findUserByProvider = async (params: ProviderUserParams) => {
  const users = await findUser({
    [Op.or]: [
      ...(params.provider ? [{ provider: params.provider }] : []),
      ...(params.provider_id ? [{ provider_id: params.provider_id }] : []),
      ...(params.provider_username ? [{ provider_username: params.provider_username }] : []),
      ...(params.provider_email ? [{ provider_email: params.provider_email }] : []),
    ],
  })
  return users
}
