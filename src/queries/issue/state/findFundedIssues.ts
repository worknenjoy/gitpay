import Models from '../../../models'
import { TaskStates } from '../../../constants/task'

const models = Models as any

const findFundedIssues = async () => {
  return models.Task.findAll({
    where: { state: TaskStates.FUNDED },
    include: [{ model: models.Order }]
  })
}

export default findFundedIssues
