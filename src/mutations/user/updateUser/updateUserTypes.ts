import Models = require('../../../models')
import { type UserParameters, TypeRef } from '../../user/updateUser/updateUser'

const models = Models as any

export const updateUserTypes = async (userParameters: UserParameters, currentUser:any) => {
  if (userParameters.Types && Array.isArray(userParameters.Types)) {
    await currentUser.setTypes([])
    const types = await Promise.all(
      userParameters.Types.map(async (t: TypeRef) => {
        const type = await models.Type.findByPk(t.id)
        if (type) {
          await currentUser.addType(type)
        }
        return t
      })
    )
    return { ...currentUser.dataValues, Types: types }
  }

  const updatedUser = await models.User.findByPk(currentUser.id, {
    include: [models.Type]
  })
  return updatedUser
}