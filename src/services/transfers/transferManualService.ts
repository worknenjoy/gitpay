import requestPromise from 'request-promise'
import models from '../../models'
import { findTransferByTaskId } from '../../queries/transfer/findTransferByTaskId'
import { findTaskByIdWithOrdersAndUser } from '../../queries/task/findTaskByIdWithOrdersAndUser'
import { createTransferRecord } from '../../mutations/transfer/createTransferRecord'
import { markIssueAsClaimed } from '../../mutations/issue/state/markIssueStateAsClaimed'
import { assignExists as assignExist } from '../../modules/assigns'
import { taskSolutionFetchData } from '../../modules/tasks/taskSolutionFetchData'
import TransferMail from '../../mail/transfer'

const currentModels = models as any

type TransferManualServiceParams = {
  taskId: number
  pullRequestURL: string
  userId?: number
}

export type TransferManualServiceResult = {
  transfer: any
  taskSolution: any
  recipientUser: any
  taskOwnerUserId: number
  validationFlags: {
    isAuthorOfPR: boolean
    isConnectedToGitHub: boolean
    isPRMerged: boolean
    isIssueClosed: boolean
    hasIssueReference: boolean
  }
}

export async function transferManualService(
  params: TransferManualServiceParams
): Promise<TransferManualServiceResult> {
  const { taskId, pullRequestURL } = params

  const existingTransfer = await findTransferByTaskId(taskId)
  if (existingTransfer) {
    throw new Error('Transfer already exists for this task')
  }

  const pullRequestURLSplitted = pullRequestURL.split('/')
  const owner = pullRequestURLSplitted[3]
  const repositoryName = pullRequestURLSplitted[4]
  const pullRequestId = pullRequestURLSplitted[6]

  let recipientUser: any

  if (params.userId) {
    recipientUser = await currentModels.User.findOne({ where: { id: params.userId } })
    if (!recipientUser) {
      throw new Error(`User with id ${params.userId} not found`)
    }
  } else {
    const prResponse = await requestPromise({
      uri: `https://api.github.com/repos/${owner}/${repositoryName}/pulls/${pullRequestId}`,
      headers: {
        'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0'
      }
    })
    const prData = JSON.parse(prResponse)
    const prAuthorLogin = prData.user.login

    recipientUser = await currentModels.User.findOne({
      where: { provider_username: prAuthorLogin }
    })
    if (!recipientUser) {
      throw new Error(`No user found with provider_username '${prAuthorLogin}'`)
    }
  }

  const task = await currentModels.Task.findOne({ where: { id: taskId } })
  if (!task) {
    throw new Error(`Task ${taskId} not found`)
  }

  const validationFlags = await taskSolutionFetchData({
    pullRequestId,
    userId: recipientUser.id,
    repositoryName,
    owner,
    taskId
  })

  const taskWithOrders = await findTaskByIdWithOrdersAndUser(taskId)
  const taskData = taskWithOrders?.dataValues

  if (!taskData) throw new Error('No valid task data')
  if (!taskData.Orders || taskData.Orders.length === 0) throw new Error('No orders found')

  let finalValue = 0
  let stripeTotal = 0
  let paypalTotal = 0

  taskData.Orders.forEach((order: any) => {
    if (order.paid) {
      finalValue += parseFloat(order.amount)
      if (order.provider === 'stripe' || order.provider === 'wallet') {
        stripeTotal += parseFloat(order.amount)
      } else if (order.provider === 'paypal') {
        paypalTotal += parseFloat(order.amount)
      }
    }
  })

  if (finalValue === 0) throw new Error('No paid orders found')

  const existingAssign = await assignExist({ userId: recipientUser.id, taskId })
  const assign = existingAssign || (await task.createAssign({ userId: recipientUser.id }))

  if (!assign) throw new Error('Could not create assign')

  await currentModels.Task.update(
    { assigned: assign.dataValues?.id ?? assign.id },
    { where: { id: taskId } }
  )

  const transfer = await createTransferRecord({
    taskId,
    userId: taskData.User.dataValues.id,
    to: recipientUser.id,
    value: finalValue,
    transfer_method: 'manual',
    stripeTotal,
    paypalTotal,
    status: 'pending'
  })

  TransferMail.success(recipientUser.dataValues ?? recipientUser, taskData, taskData.value)

  await currentModels.Task.update({ paid: true }, { where: { id: taskId } })

  await markIssueAsClaimed(taskId)

  const taskSolution = await currentModels.TaskSolution.create({
    pullRequestURL,
    taskId,
    userId: recipientUser.id,
    isAuthorOfPR: validationFlags.isAuthorOfPR,
    isConnectedToGitHub: validationFlags.isConnectedToGitHub,
    isPRMerged: validationFlags.isPRMerged,
    isIssueClosed: validationFlags.isIssueClosed,
    hasIssueReference: validationFlags.hasIssueReference
  })

  return {
    transfer,
    taskSolution,
    recipientUser: recipientUser.dataValues ?? recipientUser,
    taskOwnerUserId: taskData.User.dataValues.id,
    validationFlags
  }
}

export async function getRecipientFromPR(pullRequestURL: string): Promise<any> {
  const parts = pullRequestURL.split('/')
  const owner = parts[3]
  const repositoryName = parts[4]
  const pullRequestId = parts[6]

  const prResponse = await requestPromise({
    uri: `https://api.github.com/repos/${owner}/${repositoryName}/pulls/${pullRequestId}`,
    headers: {
      'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0'
    }
  })
  const prData = JSON.parse(prResponse)
  const prAuthorLogin = prData.user.login

  const user = await models.User.findOne({ where: { provider_username: prAuthorLogin } } as any)
  return { prAuthorLogin, user }
}
