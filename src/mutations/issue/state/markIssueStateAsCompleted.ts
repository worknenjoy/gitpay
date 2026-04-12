import { TaskStates } from '../../../constants/task'
import Models from '../../../models'

const models = Models as any

export const markIssueStateAsCompleted = async (issueId: number) => {
  const issue = await models.Task.findByPk(issueId, {
    include: [models.Order, models.Transfer]
  })

  if (!issue) {
    throw new Error(`Issue with id ${issueId} not found`)
  }

  if (issue.state === TaskStates.COMPLETED) {
    throw new Error(`Issue with id ${issueId} is already in COMPLETED state`)
  }

  if (issue.state !== TaskStates.CLAIMED) {
    throw new Error(
      `Issue with id ${issueId} is not in CLAIMED state and cannot be marked as COMPLETED`
    )
  }
  await issue.update({ state: TaskStates.COMPLETED })
  await issue.reload() // Reload the issue to get the updated state
  return issue
}
