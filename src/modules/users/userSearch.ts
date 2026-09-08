import Models from '../../models'
import {
  publicUserSearchAttributes,
  publicUserSearchWhere
} from '../../utils/auth/public-user-search'

const models = Models as any

export const userSearch = async (params: any) => {
  try {
    const where = publicUserSearchWhere(params)
    const attributes = publicUserSearchAttributes(where)
    const users = await models.User.findAll({
      where,
      attributes,
      include: [models.Type]
    })

    if (!users || users.length <= 0) return false

    return users
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    return false
  }
}
