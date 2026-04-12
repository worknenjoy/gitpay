import Models from '../../../models'
import { TaskStates } from '../../../constants/task'

const models = Models as any

const findNewClaimedIssues = async () => {
  const tasks = await models.Task.findAll({
    where: {
      state: {
        [models.Sequelize.Op.notIn]: [TaskStates.CLAIMED, TaskStates.COMPLETED, TaskStates.CLOSED]
      },
      [models.Sequelize.Op.or]: [
        { paid: true },
        { transfer_id: { [models.Sequelize.Op.ne]: null } },
        { TransferId: { [models.Sequelize.Op.ne]: null } },
        { '$Transfer.id$': { [models.Sequelize.Op.ne]: null } }
      ]
    },
    include: [models.Order, models.Transfer]
  })
  return tasks
}

export default findNewClaimedIssues
