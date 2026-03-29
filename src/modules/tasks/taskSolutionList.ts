import models from '../../models'

const currentModels = models as any

export async function taskSolutionList(userId: number) {
  try {
    const data = await currentModels.TaskSolution.findAll({
      where: { userId },
      include: [{ model: currentModels.Task }],
      order: [['createdAt', 'DESC']]
    })
    return data
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
    throw new Error('COULD_NOT_LIST_TASK_SOLUTIONS')
  }
}
