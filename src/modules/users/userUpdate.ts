import { type UserParameters, updateUser } from '../../mutations/user/updateUser/updateUser'
import updateUserAccount from '../../mutations/user/updateUser/updateUserAccount'
import { updateUserTypes } from '../../mutations/user/updateUser/updateUserTypes'
import { findUser } from '../../queries/user/findUser'


const userUpdate = async (userParameters: UserParameters) => {
  const currentUser = await findUser(userParameters.id)
  const userUpdated = await updateUser(userParameters)
  await updateUserAccount(userParameters, currentUser)
  const updatedUserWithTypes = await updateUserTypes(userParameters, userUpdated)
  return updatedUserWithTypes
}

export default userUpdate
