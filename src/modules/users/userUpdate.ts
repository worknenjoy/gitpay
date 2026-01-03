import Models = require('../../models')

const models = Models as any

type TypeRef = { id: number }
interface UserParameters {
  id: number
  Types?: TypeRef[]
  [key: string]: any
}

const userUpdate = async (userParameters: UserParameters) => {
  try {
    const result = await models.User.update(
      userParameters,
      {
        where: { id: userParameters.id },
        returning: true,
        plain: true
      }
    )

    const currentUser = result[1]

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

    const updatedUser = await models.User.findByPk(currentUser.dataValues.id, {
      include: [models.Type]
    })
    return updatedUser
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    return false
  }
}

export default userUpdate
