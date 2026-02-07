import {
  taskBuilds,
  taskSearch,
  taskFetch,
  taskUpdate,
  taskPayment,
  taskSync,
  taskDeleteById,
  taskInvite,
  taskFunding,
  taskDeleteConfirmation,
  taskMessage,
  taskMessageAuthor,
  taskReport,
  requestClaim,
  removeAssignedUser as taskRemoveAssignedUser,
  invite as taskRequestAssignedUserInvite,
  confirm as taskRequestAssignedUserConfirm
} from '../../modules/tasks'
import { offerMessage, offerUpdate } from '../../modules/offers'

export const createTask = async (req: any, res: any) => {
  try {
    req.body.userId = req.user.id
    const data = await taskBuilds(req.body)
    res.send(data)
  } catch (error: any) {
    if (error && error.statusCode === 403 && error.message.indexOf('rate limit exceeded') > -1) {
      res.status(403).send({ error: 'API rate limit exceeded' })
      return
    }
    if (error.StatusCodeError) res.status(error.StatusCodeError).send(error)
    if (error.name === 'SequelizeUniqueConstraintError') {
      const task = await taskSearch({ url: req.body.url })
      res.send({ ...error, ...{ id: task[0].id } })
    } else {
      res.send(error)
    }
  }
}

export const listTasks = async (req: any, res: any) => {
  try {
    let query = { ...req.query }

    // Normalize array parameters sent as languageIds[] and labelIds[]
    if (query['languageIds[]']) {
      query.languageIds = Array.isArray(query['languageIds[]'])
        ? query['languageIds[]']
        : [query['languageIds[]']]
      delete query['languageIds[]']
    }
    if (query['labelIds[]']) {
      query.labelIds = Array.isArray(query['labelIds[]'])
        ? query['labelIds[]']
        : [query['labelIds[]']]
      delete query['labelIds[]']
    }

    const data = await taskSearch(query)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const fetchTask = async (req: any, res: any) => {
  try {
    const data = await taskFetch(req.params)
    res.send(data)
  } catch (error: any) {
    if (error.statusCode === 403 && error.error.indexOf('rate limit exceeded') > -1) {
      res.status(403).send({ error: 'API rate limit exceeded' })
      return
    }
    res.send(false)
  }
}

export const updateTask = async (req: any, res: any) => {
  try {
    req.body.userId = req.user.id
    const data = await taskUpdate(req.body)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on update issue', error)
    res.status(400).send(error)
  }
}

export const paymentTask = async (req: any, res: any) => {
  try {
    const data = await taskPayment(req.body)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on task controller', error)
    // eslint-disable-next-line no-console
    console.log('error raw', error)
    res.send({ error: error.raw })
  }
}

export const syncTask = async (req: any, res: any) => {
  try {
    /* eslint-disable no-sync */
    const data = await taskSync(req.params)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on sync task controller', error)
    // eslint-disable-next-line no-console
    console.log('error raw', error)
    res.send({ error: error })
  }
}

export const deleteTaskById = async (req: any, res: any) => {
  try {
    const params = { id: req.params.id, userId: req.user.id }
    const deleted = await taskDeleteById(params)
    res.status(200).send(`${deleted}`)
  } catch (error: any) {
    if (error.message === 'CANNOT_DELETE_ISSUE_WITH_ORDERS_ASSOCIATED') {
      return res.status(500).json({ error: error.message })
    }
    res.status(500)
  }
}

// Delete task from report email
export const deleteTaskFromReport = async (req: any, res: any) => {
  try {
    const params = {
      id: req.params.taskId,
      userId: req.params.userId,
      title: req.query.title,
      reason: req.query.reason
    }
    const deleted = await taskDeleteById(params)
    deleted === 0
      ? res
          .status(200)
          .send(
            'There was an error in deleting the task from the database, or the task was already deleted'
          )
      : res.status(200).send(`${deleted} rows were deleted from the database`)

    try {
      await taskDeleteConfirmation(params)
      res.send('Confirmation email sent to user')
    } catch (error: any) {
      res.send({ error: error.message })
    }
  } catch (error: any) {
    res.status(400).send(error)
  }
  // eslint-disable-next-line no-console
  console.log('The task was deleted')
}

// invite functions
export const inviteUserToTask = async ({ params, body }: any, res: any) => {
  try {
    const data = await taskInvite(params, body)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on task controller invite', error)
    res.send({ error: error.message })
  }
}

export const inviteToFundingTask = async ({ params, body }: any, res: any) => {
  try {
    const data = await taskFunding(params, body)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on task controller funding', error)
    res.send({ error: error.message })
  }
}

// message to interest users
export const messageInterestedToTask = async ({ params, body, user }: any, res: any) => {
  try {
    const data = await taskMessage(params, body, user)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on task controller message', error)
    res.send({ error: error.message })
  }
}

// message to authors
export const messageAuthor = async ({ params, body, user }: any, res: any) => {
  try {
    const data = await taskMessageAuthor(params, body, user)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on task controller message to author', error)
    res.send({ error: error.message })
  }
}

// message to offers
export const messageOffer = async ({ params, body, user }: any, res: any) => {
  try {
    const data = await offerMessage(params, body, user)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on task controller message to offer', error)
    res.send({ error: error.message })
  }
}

// update offer
export const updateOffer = async ({ params, body }: any, res: any) => {
  try {
    const data = await offerUpdate(params, body)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on task controller update offer', error)
    res.send({ error: error.message })
  }
}

// Assigns functions.
export const removeAssignedUser = async (req: any, res: any) => {
  try {
    const params = { id: req.params.id, userId: req.user.id }
    const data = await taskRemoveAssignedUser(params, req.body)
    res.send(data)
  } catch (error: any) {
    res.send({ error: error.message })
  }
}

export const requestAssignedUser = async (req: any, res: any) => {
  try {
    const data = await taskRequestAssignedUserInvite(req.body)
    res.send(data)
  } catch (error: any) {
    res.send({ error: error.message })
  }
}

export const assignedUser = async (req: any, res: any) => {
  try {
    const data = await taskRequestAssignedUserConfirm(req.body)
    res.send(data)
  } catch (error: any) {
    res.status(400).send({ error: error.message })
  }
}

// Report Task
export const reportTask = async ({ params, body }: any, res: any) => {
  try {
    const data = await taskReport(params, body)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on task controller report', error)
    res.send({ error: error.message })
  }
}

// Request Claim Task
export const requestClaimTask = async (req: any, res: any) => {
  try {
    const data = await requestClaim(req.body)
    res.send(data)
  } catch (error: any) {
    res.send({ error: error.message })
  }
}
