import Models from '../../../models'
import { TaskStates } from '../../../constants/task'

const models = Models as any

const findFundedIssuesToRevertToCreated = async () => {
  const fundedTasks = await models.Task.findAll({
    where: { state: TaskStates.FUNDED },
    include: [{ model: models.Order }]
  })

  return fundedTasks.filter((task: any) => {
    const orders = task.Orders ?? []
    const hasSucceededOrder = orders.some((o: any) => o.status === 'succeeded')
    const hasRefundedOrder = orders.some((o: any) => o.status === 'refunded')
    return !hasSucceededOrder && hasRefundedOrder
  })
}

export default findFundedIssuesToRevertToCreated
