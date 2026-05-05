import Models from '../../../models'
import { TaskStates } from '../../../constants/task'

const models = Models as any

const findFundedIssuesWithoutFundedAt = async () => {
  const tasks = await models.Task.findAll({
    where: {
      state: TaskStates.FUNDED,
      funded_at: null
    },
    include: [models.Order]
  })
  return tasks.filter((task: any) => task.Orders && task.Orders.length > 0)
}

export default findFundedIssuesWithoutFundedAt
