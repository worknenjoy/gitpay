import models from '../../models'

const currentModels = models as any

type AssignExistsParams = {
  userId: number
  taskId: number
}

export async function assignExists(assignAttributes: AssignExistsParams) {
  try {
    const assign = await currentModels.Assign.findOne({
      where: {
        userId: assignAttributes.userId,
        TaskId: assignAttributes.taskId
      }
    })

    if (!assign) return false
    return assign
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    throw error
  }
}
