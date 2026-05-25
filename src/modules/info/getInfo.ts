import models from '../../models'
import { fetchChannelUserCount } from './fetchChannelUserCount'

const currentModels = models as any

export async function getInfo() {
  const countTasks = await currentModels.Task.count()
  const tasks = await currentModels.Task.findAll({ attributes: ['value'] })
  const countUsers = await currentModels.User.count()
  if (!tasks) throw new Error('Could not fetch tasks')
  const bounties = tasks
    .filter((t: any) => t.value)
    .reduce((acc: number, t: any) => acc + parseInt(t.value), 0)
  const channelUserCount = await fetchChannelUserCount()
  return { tasks: countTasks, bounties, users: countUsers, channelUserCount }
}
