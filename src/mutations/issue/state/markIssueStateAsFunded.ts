import { TaskStates } from '../../../constants/task'
import Models from '../../../models'
import { fillIssueFundedAt } from './fillIssueFundedAt'

const models = Models as any

export const markIssueStateAsFunded = async (issueId: number) => {
  const issue = await models.Task.findByPk(issueId, {
    include: [models.Order]
  })

  if (!issue) {
    throw new Error(`Issue with id ${issueId} not found`)
  }

  if (issue.state !== TaskStates.CREATED) {
    throw new Error(
      `Issue with id ${issueId} is already past CREATED state (current: ${issue.state})`
    )
  }

  await issue.update({ state: TaskStates.FUNDED })
  await fillIssueFundedAt(issue)
  await issue.reload()
  return issue
}
