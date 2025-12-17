const Tasks = require('../../modules/tasks')
const Offers = require('../../modules/offers')

exports.createTask = (req, res) => {
  req.body.userId = req.user.id
  Tasks.taskBuilds(req.body)
    .then((data) => {
      res.send(data)
    })
    .catch(async (error) => {
      if (error.statusCode === 403 && error.error.indexOf('rate limit exceeded') > -1) {
        res.status(403).send({ error: 'API rate limit exceeded' })
        return
      }
      if (error.StatusCodeError) res.status(error.StatusCodeError).send(error)
      if (error.name === 'SequelizeUniqueConstraintError') {
        const task = await Tasks.taskSearch({ url: req.body.url })
        res.send({ ...error, ...{ id: task[0].id } })
      } else {
        res.send(error)
      }
    })
}

exports.listTasks = (req, res) => {
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

  Tasks.taskSearch(query)
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.fetchTask = (req, res) => {
  Tasks.taskFetch(req.params)
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      if (error.statusCode === 403 && error.error.indexOf('rate limit exceeded') > -1) {
        res.status(403).send({ error: 'API rate limit exceeded' })
        return
      }
      res.send(false)
    })
}

exports.updateTask = (req, res) => {
  req.body.userId = req.user.id
  Tasks.taskUpdate(req.body)
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error on update issue', error)
      res.status(400).send(error)
    })
}

exports.paymentTask = (req, res) => {
  Tasks.taskPayment(req.body)
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error on task controller', error)
      // eslint-disable-next-line no-console
      console.log('error raw', error)
      res.send({ error: error.raw })
    })
}

exports.syncTask = (req, res) => {
  /* eslint-disable no-sync */
  Tasks.taskSync(req.params)
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error on sync task controller', error)
      // eslint-disable-next-line no-console
      console.log('error raw', error)
      res.send({ error: error })
    })
}

exports.deleteTaskById = (req, res) => {
  const params = { id: req.params.id, userId: req.user.id }
  Tasks.taskDeleteById(params)
    .then((deleted) => {
      res.status(200).send(`${deleted}`)
    })
    .catch((error) => {
      console.log('error', error)
      res.status(error.status ?? 500).json({ error: error.message})
    })
}

// Delete task from report email
exports.deleteTaskFromReport = (req, res) => {
  const params = {
    id: req.params.taskId,
    userId: req.params.userId,
    title: req.query.title,
    reason: req.query.reason
  }
  Tasks.taskDeleteById(params)
    .then((deleted) => {
      deleted === 0
        ? res
            .status(200)
            .send(
              'There was an error in deleting the task from the database, or the task was already deleted'
            )
        : res.status(200).send(`${deleted} rows were deleted from the database`)
    })
    .catch((error) => {
      res.status(400).send(error)
    })
    .then(() => {
      Tasks.taskDeleteConfirmation(params)
        .then(() => res.send('Confirmation email sent to user'))
        .catch((error) => {
          res.send({ error: error.message })
        })
    })
  // eslint-disable-next-line no-console
  console.log('The task was deleted')
}

// invite functions
exports.inviteUserToTask = ({ params, body }, res) =>
  Tasks.taskInvite(params, body)
    .then((data) => res.send(data))
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error on task controller invite', error)
      res.send({ error: error.message })
    })

exports.inviteToFundingTask = ({ params, body }, res) =>
  Tasks.taskFunding(params, body)
    .then((data) => res.send(data))
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error on task controller funding', error)
      res.send({ error: error.message })
    })

// message to interest users
exports.messageInterestedToTask = ({ params, body, user }, res) =>
  Tasks.taskMessage(params, body, user)
    .then((data) => res.send(data))
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error on task controller message', error)
      res.send({ error: error.message })
    })

// message to authors
exports.messageAuthor = ({ params, body, user }, res) =>
  Tasks.taskMessageAuthor(params, body, user)
    .then((data) => res.send(data))
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error on task controller message to author', error)
      res.send({ error: error.message })
    })

// message to offers
exports.messageOffer = ({ params, body, user }, res) =>
  Offers.offerMessage(params, body, user)
    .then((data) => res.send(data))
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error on task controller message to offer', error)
      res.send({ error: error.message })
    })

// update offer
exports.updateOffer = ({ params, body }, res) =>
  Offers.updateOffer(params, body)
    .then((data) => res.send(data))
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error on task controller update offer', error)
      res.send({ error: error.message })
    })

// Assigns functions.
exports.removeAssignedUser = (req, res) => {
  const params = { id: req.params.id, userId: req.user.id }
  Tasks.removeAssignedUser(params, req.body)
    .then((data) => res.send(data))
    .catch((error) => res.send({ error: error.message }))
}

exports.requestAssignedUser = (req, res) => {
  Tasks.requestAssignedUser
    .invite(req.body)
    .then((data) => res.send(data))
    .catch((error) => res.send({ error: error.message }))
}

exports.assignedUser = (req, res) => {
  Tasks.requestAssignedUser
    .confirm(req.body)
    .then((data) => res.send(data))
    .catch((error) => res.status(400).send({ error: error.message }))
}

// Report Task
exports.reportTask = ({ params, body }, res) => {
  Tasks.taskReport(params, body)
    .then((data) => res.send(data))
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error on task controller report', error)
      res.send({ error: error.message })
    })
}

// Request Claim Task
exports.requestClaimTask = (req, res) => {
  Tasks.taskClaim
    .requestClaim(req.body)
    .then((data) => res.send(data))
    .catch((error) => res.send({ error: error.message }))
}
