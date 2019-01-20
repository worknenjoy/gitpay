const rp = require('request-promise')
const { slack } = require('../../../config/secrets')
const models = require('../../../models')

const fetchChannelUserCount = async () => {
  const data = await rp({
    uri: 'https://slack.com/api/conversations.list',
    headers: {
      Authorization: 'Bearer ' + slack.token
    },
    json: true
  })
  if (data.ok) {
    const channel = data.channels.find(channel => channel.id === slack.channelId)
    if (!channel) {
      // eslint-disable-next-line no-console
      console.error('Invalid channel id ' + slack.channelId)
    }
    else {
      return channel.num_members
    }
  }
  else {
    // throw new Error(data.error)
    return 0
  }
}

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
    const channelUserCount = await fetchChannelUserCount()

    res.send({
      tasks: countTasks,
      bounties: bounties,
      users: countUsers,
      channelUserCount
    })
  }
  catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}
