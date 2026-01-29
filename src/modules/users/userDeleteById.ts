import models from '../../models'
import db from '../../models/index'
import { taskDeleteById } from '../tasks/index'

const currentModels = models as any

type UserDeleteByIdParams = {
  id: number
}

export async function userDeleteById(userParameters: UserDeleteByIdParams) {
  try {
    return await db.sequelize.transaction(async (t: any) => {
      const tasks = await currentModels.Task.findAll({
        where: {
          userId: userParameters.id
        }
      })

      for (const task of tasks) {
        await taskDeleteById({
          id: task.dataValues.id,
          userId: userParameters.id
        })
      }

      await currentModels.Assign.destroy({ where: { userId: userParameters.id }, transaction: t })
      await currentModels.Offer.destroy({ where: { userId: userParameters.id }, transaction: t })
      await db.sequelize.query(`DELETE FROM "User_Types" WHERE "UserId" = ${userParameters.id}`, {
        transaction: t
      })

      const user = await currentModels.User.destroy({
        where: {
          id: userParameters.id
        },
        force: true,
        transaction: t
      })

      // eslint-disable-next-line no-console
      console.log('destroy', user)

      return user
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('error to delete user', err)
  }
}
