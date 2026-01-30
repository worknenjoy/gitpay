import models from '../../models'

const currentModels = models as any

export async function taskSolutionGet(taskId: number, userId: number) {
  try {
    const data = await currentModels.TaskSolution.findOne({
      where: { taskId: taskId, userId: userId }
    })

    if (!data) {
      return {}
    }

    return data
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)

    throw new Error('COULD_NOT_GET_TASK_SOLUTION')
  }
}
