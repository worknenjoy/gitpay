import { type UserParameters, updateUser } from '../../mutations/user/updateUser/updateUser'
import updateUserAccount from '../../mutations/user/updateUser/updateUserAccount'
import { updateUserTypes } from '../../mutations/user/updateUser/updateUserTypes'
import { findUser } from '../../queries/user/findUser'
import Models from '../../models'

const models = Models as any

const userUpdate = async (userParameters: UserParameters) => {
  const currentUser = await findUser(userParameters.id)
  await updateUserAccount(userParameters, currentUser)

  return models.sequelize.transaction(async (tx:any) => {
    const userUpdated = await updateUser(userParameters, tx)
    const updatedUserWithTypes = await updateUserTypes(userParameters, userUpdated, tx)
    return updatedUserWithTypes
  })
}

export default userUpdate
