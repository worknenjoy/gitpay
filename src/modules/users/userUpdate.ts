import { type UserParameters, updateUser } from '../../mutations/user/updateUser/updateUser'
import { updateUserTypes } from '../../mutations/user/updateUser/updateUserTypes'
import Models from '../../models'

const models = Models as any

const userUpdate = async (userParameters: UserParameters) => {
  if (!userParameters.id) {
    throw new Error('User id is required to update user')
  }

  const allowedFieldsToUpdate = [
    'name',
    'account_id',
    'Types'
  ]

  if(userParameters.email) {
    throw new Error('user.update.cannot_update_email')
  }

  return models.sequelize.transaction(async (tx: any) => {
    const userUpdated = await updateUser(userParameters, tx)
    const updatedUserWithTypes = await updateUserTypes(userParameters, userUpdated, tx)
    return updatedUserWithTypes
  })
}

export default userUpdate
