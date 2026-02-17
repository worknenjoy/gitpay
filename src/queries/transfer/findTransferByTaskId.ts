import Models from '../../models'

const models = Models as any

export const findTransferByTaskId = async (taskId: number, options: any = {}) => {
  return models.Transfer.findOne({
    where: {
      taskId
    },
    ...options
  })
}
