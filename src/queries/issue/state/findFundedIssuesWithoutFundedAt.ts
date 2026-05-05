import Models from '../../../models'
import { Op } from 'sequelize'
import { TaskStates } from '../../../constants/task'

const models = Models as any

const findFundedIssuesWithoutFundedAt = async () => {
  const tasks = await models.Task.findAll({
    where: {
      state: {
        [Op.in]: [TaskStates.FUNDED, TaskStates.CLAIMED, TaskStates.COMPLETED]
      },
      funded_at: null
    },
    include: [models.Order]
  })
  return tasks.filter((task: any) => task.Orders && task.Orders.length > 0)
}

export default findFundedIssuesWithoutFundedAt
