import { Op } from 'sequelize'
import { type Issue, type IssueStatus } from '../../../types/issue'
import Models from '../../../models'
import { IssueStatuses } from '../../../constants/issue'
const models = Models as any

export const findUnclaimedBounties = async () => {
  const tasks = await models.Task.findAll({
    where: {
      value: { [Op.gt]: 0 },
      status: IssueStatuses.CLOSED as IssueStatus
    },
    include: [models.Order, models.Transfer]
  })

  const pendingTasks = tasks.filter(
    (t: Issue) =>
      !t.paid && (t.transfer_id === null || t.TransferId === null || t?.Transfer?.id === null)
  )
  return pendingTasks
}
