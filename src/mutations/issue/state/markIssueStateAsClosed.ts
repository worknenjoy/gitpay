import { TaskStates, ClosedReasons, type ClosedReason } from '../../../constants/task'
import Models from '../../../models'

const models = Models as any

export const markIssueStateAsClosed = async (
  issueId: number,
  comment?: string,
  closedReason?: ClosedReason
) => {
  const issue = await models.Task.findByPk(issueId)

  if (!issue) {
    throw new Error(`Issue with id ${issueId} not found`)
  }

  if (issue.state === TaskStates.CLOSED) {
    throw new Error(`Issue with id ${issueId} is already in CLOSED state`)
  }

  await issue.update({
    state: TaskStates.CLOSED,
    closed_reason: closedReason ?? ClosedReasons.OTHER,
    closed_at: new Date(),
    comment: comment ?? 'donated claimed bounty to Gitpay platform'
  })
  await issue.reload()
  return issue
}
