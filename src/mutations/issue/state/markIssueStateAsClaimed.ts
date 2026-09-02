import { TaskStates } from '../../../constants/task'
import Models from '../../../models'
import { fillIssueTimestampFromTransfer } from './fillIssueTimestampFromTransfer'
import TransferMail from '../../../mail/transfer'
import { findUserByIdSimple } from '../../../queries/user/findUserByIdSimple'

const models = Models as any

export const markIssueAsClaimed = async (issueId: number) => {
  const issue = await models.Task.findByPk(issueId, {
    include: [{ model: models.Order, include: [models.User] }, models.Transfer, models.User]
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

  if (issue.Transfer?.to) {
    const claimedByUser = await findUserByIdSimple(issue.Transfer.to)
    const value = issue.Transfer.value

    if (claimedByUser?.dataValues) {
      if (issue.User) {
        TransferMail.claimInitiatedNotifyOwner(issue.User, issue, claimedByUser.dataValues, value)
      }

      const backers = new Map<number, any>()
      for (const order of issue.Orders || []) {
        if (order.paid && order.User) {
          backers.set(order.User.id, order.User)
        }
      }
      for (const backer of backers.values()) {
        TransferMail.claimInitiatedNotifyBacker(backer, issue, claimedByUser.dataValues, value)
      }
    }
  }

  return issue
}
