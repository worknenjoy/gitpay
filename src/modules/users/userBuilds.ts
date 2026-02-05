import models from '../../models'
import UserMail from '../../mail/user'

const currentModels = models as any

type UserBuildsParams = {
  password?: string
  activation_token?: string
  provider?: string
  email?: string
  confirmPassword?: string
  Types?: number[]
  [key: string]: any
}

export async function userBuilds(userParameters: UserBuildsParams) {
  const selectedTypeIds = userParameters.Types
  if (userParameters.password) {
    userParameters.password = currentModels.User.generateHash(userParameters.password)
  }
  userParameters.activation_token = currentModels.User.generateToken()
  if (userParameters.provider) {
    userParameters.email_verified = true
  } else {
    userParameters.email_verified = false
  }
  if (!userParameters.email && !userParameters.password && !userParameters.confirmPassword)
    return false
  try {
    const user = await currentModels.User.build(userParameters).save()
    const { dataValues } = user
    if (dataValues && dataValues.id) {
      const { id, name, activation_token } = dataValues
      if (!userParameters.provider) {
        UserMail.activation(dataValues, activation_token)
      }
      if (selectedTypeIds && selectedTypeIds.length > 0) {
        await user.setTypes(selectedTypeIds)
        const userWithTypes = await currentModels.User.findByPk(id, {
          include: { model: currentModels.Type }
        })
        return userWithTypes
      }
    }
    return dataValues
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error from userBuilds', error)
    return false
  }
}
