import { Op } from 'sequelize'
import { type IssueStatus } from '../../../types/issue'
import Models from '../../../models'
import { IssueStatuses } from '../../../constants/issue'
const models = Models as any

export const findUnclaimedBounties = async () => {
  const tasks = await models.Task.findAll({
    where: {
      [Op.and]: [
        { value: { [Op.gt]: 0 } },
        { status: IssueStatuses.CLOSED as IssueStatus },
        { paid: false },
        { transfer_id: null },
        { TransferId: null },
        { '$Transfer.id$': null }
      ]
    },
    include: [models.Order, models.Transfer]
  })
  return tasks
}
