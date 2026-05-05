import Models from '../../../models'
import { TaskStates } from '../../../constants/task'

const models = Models as any

const findCompletedIssuesWithoutCompletedAt = async () => {
  return models.Task.findAll({
    where: {
      state: TaskStates.COMPLETED,
      completed_at: null
    },
    include: [models.Transfer]
  })
}

export default findCompletedIssuesWithoutCompletedAt
