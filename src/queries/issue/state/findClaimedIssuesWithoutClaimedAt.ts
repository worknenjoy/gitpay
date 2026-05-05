import Models from '../../../models'
import { TaskStates } from '../../../constants/task'

const models = Models as any

const findClaimedIssuesWithoutClaimedAt = async () => {
  return models.Task.findAll({
    where: {
      state: TaskStates.CLAIMED,
      claimed_at: null
    },
    include: [models.Transfer]
  })
}

export default findClaimedIssuesWithoutClaimedAt
