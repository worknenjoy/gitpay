import { Transaction } from 'sequelize'
import Models = require('../../../models')
import { type UserParameters } from '../../user/updateUser/updateUser'

const models = Models as any

export const updateUserTypes = async (
  userParameters: UserParameters,
  currentUser: any,
  tx?: Transaction
) => {
  if (userParameters.Types && Array.isArray(userParameters.Types)) {
    await currentUser.setTypes(
      userParameters.Types.map((t) => t.id),
      { transaction: tx }
    )
  }

  const updatedUser = await models.User.findByPk(currentUser.id, {
    include: [models.Type],
    transaction: tx
  })
  return updatedUser
}
