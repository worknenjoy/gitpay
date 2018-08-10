const models = require('../../../loading/loading')

exports.info = async (req, res) => {
  try {
    const countTasks = await models.Task.count()
    const tasks = await models.Task.findAll({
      where: {
        paid: true
      },
      attributes: ['value']
    })
    const countUsers = await models.User.count()
    const bounties = tasks.reduce((accumulator, task) => accumulator + parseInt(task.value), 0)

    res.send({
      tasks: countTasks,
      bounties: bounties,
      users: countUsers
    })
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}
