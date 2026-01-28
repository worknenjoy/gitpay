import { Op } from 'sequelize'
import { findUsers } from './findUsers'

type ProviderUserParams = {
  provider?: string
  provider_id?: string
  provider_username?: string
  provider_email?: string
}

export const findUsersByProvider = async (params: ProviderUserParams) => {
  const users = await findUsers({
    provider: params.provider,
    [Op.or]: [
      ...(params.provider_id ? [{ provider_id: params.provider_id }] : []),
      ...(params.provider_username ? [{ provider_username: params.provider_username }] : []),
      ...(params.provider_email ? [{ provider_email: params.provider_email }] : [])
    ]
  })
  if (!users || users.length === 0) {
    return []
  }
  return users
}
