import Models from '../../../models'
import { Op } from 'sequelize'
import { TaskStates } from '../../../constants/task'

const models = Models as any

const findClaimedIssuesWithoutClaimedAt = async () => {
  return models.Task.findAll({
    where: {
      state: {
        [Op.in]: [TaskStates.CLAIMED, TaskStates.COMPLETED]
      },
      claimed_at: null
    },
    include: [models.Transfer]
  })
}

export default findClaimedIssuesWithoutClaimedAt
