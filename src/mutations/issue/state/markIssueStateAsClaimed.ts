import { TaskStates } from '../../../constants/task'
import Models from '../../../models'
import { fillIssueTimestampFromTransfer } from './fillIssueTimestampFromTransfer'

const models = Models as any

export const markIssueAsClaimed = async (issueId: number) => {
  const issue = await models.Task.findByPk(issueId, {
    include: [models.Order, models.Transfer]
  })

  if (!issue) {
    throw new Error(`Issue with id ${issueId} not found`)
  }

  if (issue.state === TaskStates.CLAIMED) {
    throw new Error(`Issue with id ${issueId} is already in CLAIMED state`)
  }

  await issue.update({ state: TaskStates.CLAIMED })
  await fillIssueTimestampFromTransfer(issue, 'claimed_at')
  await issue.reload()
  return issue
}
