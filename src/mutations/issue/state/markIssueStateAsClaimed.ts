import { TaskStates } from "../../../constants/task"
import Models from '../../../models'

const models = Models as any


export const markIssueAsClaimed = async (issueId: number) => {
  const issue = await models.Task.findByPk(issueId, {
    include: [models.Order, models.Transfer]
  })

  if (!issue) {
    throw new Error(`Issue with id ${issueId} not found`)
  }

  if (issue.state === TaskStates.CLAIMED) {
    return issue
  }

  await issue.update({ state: TaskStates.CLAIMED })
  await issue.reload() // Reload the issue to get the updated state
  return issue
}
