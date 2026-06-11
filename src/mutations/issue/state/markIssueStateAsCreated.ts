import { TaskStates } from '../../../constants/task'
import Models from '../../../models'

const models = Models as any

export const markIssueStateAsCreated = async (issueId: number) => {
  const issue = await models.Task.findByPk(issueId)

  if (!issue) throw new Error(`Issue with id ${issueId} not found`)
  if (issue.state !== TaskStates.FUNDED) {
    throw new Error(
      `Issue with id ${issueId} must be in FUNDED state to revert to CREATED (current: ${issue.state})`
    )
  }

  await issue.update({
    state: TaskStates.CREATED,
    funded_at: null,
    comment: 'All orders were refunded — task reverted to created'
  })
  await issue.reload()
  return issue
}
