import { Op } from 'sequelize'
import { type UserParameters, updateUser } from '../../mutations/user/updateUser/updateUser'
import updateUserAccount from '../../mutations/user/updateUser/updateUserAccount'
import { updateUserTypes } from '../../mutations/user/updateUser/updateUserTypes'
import { findUserById } from '../../queries/user/findUserById'
import { findUser } from '../../queries/user/findUser'
import Models from '../../models'

const models = Models as any

const userUpdate = async (userParameters: UserParameters) => {
  if (!userParameters.id) {
    throw new Error('User id is required to update user')
  }
  if (userParameters.email) {
    const userExists = await findUser({
      email: userParameters.email,
      id: { [Op.ne]: userParameters.id }
    })
    if (userExists) {
      throw new Error('user.email.exists')
    }
    const currentUser = await findUserById(userParameters.id)
    await updateUserAccount(userParameters, currentUser)
  }

  return models.sequelize.transaction(async (tx: any) => {
    const userUpdated = await updateUser(userParameters, tx)
    const updatedUserWithTypes = await updateUserTypes(userParameters, userUpdated, tx)
    return updatedUserWithTypes
  })
}

export default userUpdate
