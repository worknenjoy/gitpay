import models from '../../models'
const stripe = require('../shared/stripe/stripe')()

const currentModels = models as any

// @TODO added variable data
const data: any = 1

export async function taskTransfer(taskParameters: any) {
  try {
    const task = await currentModels.Task.findOne(
      {
        where: {
          id: taskParameters.id
        }
      },
      { include: [currentModels.User, currentModels.Order, currentModels.Assign] }
    )

    if (!task) {
      throw new Error('find_task_error')
    }
    
    const user = await currentModels.User.findOne({
      where: {
        id: data.id
      }
    })

    const dest = user.account_id
    if (!dest) {
      return new Error('account_destination_invalid')
    }

    const transfer = await stripe.transfers.retrieve(task.transfer_id)
    
    if (transfer) {
      const update = await currentModels.Task.update(
        { paid: true, transfer_id: transfer.id },
        {
          where: {
            id: data.id
          }
        }
      )
      
      if (!update) {
        return new Error('update_task_reject')
      }
      return transfer
    }
  } catch (error) {
    throw error
  }
}
