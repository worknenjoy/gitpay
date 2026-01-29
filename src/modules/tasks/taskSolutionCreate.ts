import models from '../../models'
import { taskSolutionFetchData } from './taskSolutionFetchData'
import { taskPayment } from './taskPayment'
import { assignExists as assignExist } from '../assigns'
import { transferBuilds } from '../transfers/transferBuilds'
import { taskUpdate } from '../tasks/taskUpdate'

const currentModels = models as any

export async function taskSolutionCreate(taskSolutionParams: any) {
  const pullRequestURLSplitted = taskSolutionParams.pullRequestURL.split('/')
  const params = {
    pullRequestId: pullRequestURLSplitted[6],
    userId: taskSolutionParams.userId,
    repositoryName: pullRequestURLSplitted[4],
    owner: pullRequestURLSplitted[3],
    taskId: taskSolutionParams.taskId
  }

  const fetchTaskSolutionData = await taskSolutionFetchData(params)
  const task = await currentModels.Task.findOne({
    where: { id: taskSolutionParams.taskId }
  })

  if (
    fetchTaskSolutionData.isAuthorOfPR &&
    fetchTaskSolutionData.isConnectedToGitHub &&
    fetchTaskSolutionData.isIssueClosed &&
    fetchTaskSolutionData.isPRMerged &&
    fetchTaskSolutionData.hasIssueReference
  ) {
    if (!task.dataValues.paid && !task.dataValues.transfer_id) {
      const existingAssignment = await assignExist({
        userId: taskSolutionParams.userId,
        taskId: taskSolutionParams.taskId
      })

      const assign =
        existingAssignment || (await task.createAssign({ userId: taskSolutionParams.userId }))
      if (!assign) {
        throw new Error('COULD_NOT_CREATE_ASSIGN')
      }
      const taskUpdateAssign = await taskUpdate(
        {
          id: taskSolutionParams.taskId,
          userId: task.dataValues.userId,
          assigned: assign.dataValues.id
        },
        false
      )
      if (!taskUpdateAssign) {
        throw new Error('COULD_NOT_UPDATE_TASK')
      }
    }
    try {
      const transferSend = await transferBuilds({
        taskId: task.dataValues.id,
        userId: task.dataValues.userId
      })
      if (transferSend.error) {
        throw new Error('transferSend.error')
      }
      const taskSolutionCreateResponse = await currentModels.TaskSolution.create(taskSolutionParams)
      return taskSolutionCreateResponse
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.log('error to create task solution: ', err)
      if (
        err.type === 'StripeInvalidRequestError' &&
        err.code === 'insufficient_capabilities_for_transfer'
      ) {
        throw new Error('issue.solution.error.insufficient_capabilities_for_transfer')
      }
      throw new Error('COULD_NOT_CREATE_TASK_SOLUTION')
    }
  } else {
    throw new Error('COULD_NOT_CREATE TASK_SOLUTION')
  }
}
