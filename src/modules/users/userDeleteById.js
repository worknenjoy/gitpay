const models = require('../../models')
const db = require('../../models/index')
const { taskDeleteById } = require('../tasks/index')

const userDeleteById = async (userParameters) => {
  try {
    return await db.sequelize.transaction(async (t) => {
      const tasks = await models.Task.findAll({
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

      await models.Assign.destroy({ where: { userId: userParameters.id }, transaction: t })
      await models.Offer.destroy({ where: { userId: userParameters.id }, transaction: t })
      await db.sequelize.query(`DELETE FROM "User_Types" WHERE "UserId" = ${userParameters.id}`, {
        transaction: t
      })

      const user = await models.User.destroy({
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

module.exports = userDeleteById
