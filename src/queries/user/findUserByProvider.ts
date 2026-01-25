import Models from '../../models'
import { findUser } from './findUser'
const models = Models as any

type ProviderUserParams = {
  provider?: string
  provider_id?: string
  provider_username?: string
  provider_email?: string
}

export const findUserByProvider = async (params: ProviderUserParams) => {
  const users = await findUser(params)
  return users
}
