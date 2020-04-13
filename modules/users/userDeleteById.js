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

      const user = await models.User.destroy({ where: { id: userParameters.id }, transaction: t })

      // eslint-disable-next-line no-console
      console.log('destroy', user)

      return user
    })
  }
  catch (err) {
  }
}

module.exports = userDeleteById
