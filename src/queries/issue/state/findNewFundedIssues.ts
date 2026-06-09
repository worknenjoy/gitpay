import Models from '../../../models'
import { TaskStates } from '../../../constants/task'

const models = Models as any

const findNewFundedIssues = async () => {
  return models.Task.findAll({
    where: {
      state: TaskStates.CREATED
    },
    include: [
      {
        model: models.Order,
        where: {
          status: 'succeeded',
          paid: true
        },
        required: true
      }
    ]
  })
}

export default findNewFundedIssues
