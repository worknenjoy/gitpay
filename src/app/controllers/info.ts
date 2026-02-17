const rp = require('request-promise')
const { slack } = require('../../config/secrets')
import models from '../../models'

const fetchChannelUserCount = async () => {
  const data = await rp({
    uri: 'https://slack.com/api/conversations.list',
    headers: {
      Authorization: 'Bearer ' + slack.token
    },
    json: true
  })
  if (data.ok) {
    const channel = data.channels.find((channel: any) => channel.id === slack.channelId)
    if (!channel) {
      // eslint-disable-next-line no-console
      console.error('Invalid channel id ' + slack.channelId)
    } else {
      return channel.num_members
    }
  } else {
    // throw new Error(data.error)
    return 0
  }
}

export const info = async (req: any, res: any) => {
  try {
    const countTasks = await models.Task.count()
    const tasks = await models.Task.findAll({
      attributes: ['value']
    })
    const countUsers = await models.User.count()
    if (tasks) {
      const bounties = tasks
        .filter((t: any) => t.value)
        .reduce((accumulator: number, task: any) => accumulator + parseInt(task.value), 0)
      const channelUserCount = await fetchChannelUserCount()
      res.send({
        tasks: countTasks,
        bounties: bounties,
        users: countUsers,
        channelUserCount
      })
    } else {
      res.send(500)
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}
