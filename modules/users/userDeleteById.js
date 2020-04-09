const Promise = require('bluebird')
const models = require('../../models')
const { taskDeleteById } = require('../tasks/index')

const userDeleteById = async (userParameters) => {
  try {

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

    await models.Assign.destroy({ where: { userId: userParameters.id } }),
    await models.Offer.destroy({ where: { userId: userParameters.id } })

    // eslint-disable-next-line no-console
    // console.log('result from delete dependencies', result)
    const user = await models.User.destroy({
      where: {
        id: userParameters.id
      }
    })

    // eslint-disable-next-line no-console
    console.log('destroy', user)

    return user;

  } catch (err) {
    
  }
}

module.exports = userDeleteById;