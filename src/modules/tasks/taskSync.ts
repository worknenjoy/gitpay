import models from '../../models'
import { summarizeTaskOrders } from './taskOrderSummary'

const currentModels = models as any

export async function taskSync(taskParameters: any) {
  // eslint-disable-next-line no-console
  const task = await currentModels.Task.findByPk(taskParameters.id, {
    include: [currentModels.Order]
  })

  if (!task) {
    throw new Error('Task not found')
  }

  const finalValue = summarizeTaskOrders(task.dataValues.Orders)

  const paidPaypal = !!(
    finalValue.paypal.equals(0) || finalValue.transferred.equals(finalValue.available)
  )
  const paidStripe = !!task.transfer_id
  const paid = paidPaypal && paidStripe

  let taskAttributes: any = { value: finalValue.available, paid }
  if (paid) {
    taskAttributes.status = 'closed'
  }

  const updatedTask = await task.set(taskAttributes).save()

  if (updatedTask) {
    return {
      value: finalValue
    }
  }
}
