const Tasks = require('../../tasks')

exports.createTask = (req, res) => {
  req.body.userId = req.user.id
  Tasks.taskBuilds(req.body)
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('createTask error on controller', error)
      res.status(error.StatusCodeError || 400).send(error)
    })
}

exports.listTasks = (req, res) => {
  Tasks.taskSearch()
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.fetchTask = (req, res) => {
  Tasks.taskFetch(req.params)
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.updateTask = (req, res) => {
  Tasks.taskUpdate(req.body)
    .then(data => {
      res.send(data)
    }).catch(error => {
      res.status(400).send(error)
    })
}

exports.paymentTask = (req, res) => {
  Tasks.taskPayment(req.body)
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('error on task controller', error)
      // eslint-disable-next-line no-console
      console.log('error raw', error.raw)
      res.send({ error: error.raw })
    })
}

exports.syncTask = (req, res) => {
  /* eslint-disable no-sync */
  Tasks.taskSync(req.params)
    .then(data => {
      res.send(data)
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error on task controller', error)
      // eslint-disable-next-line no-console
      console.log('error raw', error.raw)
      res.send({ error: error.raw })
    })
}

exports.deleteTaskById = (req, res) => {
  const params = { id: req.params.id, userId: req.user.id }
  Tasks.taskDeleteById(params)
    .then((deleted) => {
      res.status(200).send(`${deleted}`)
    }).catch(error => {
      res.status(400).send(error)
    })
}

// invite functions
exports.inviteUserToTask = ({ params, body }, res) => Tasks
  .taskInvite(params, body)
  .then(data => res.send(data))
  .catch(error => {
    // eslint-disable-next-line no-console
    console.log('error on task controller invite', error)
    res.send({ error: error.message })
  })

exports.inviteToFundingTask = ({ params, body }, res) => Tasks
  .taskFunding(params, body)
  .then(data => res.send(data))
  .catch(error => {
    // eslint-disable-next-line no-console
    console.log('error on task controller funding', error)
    res.send({ error: error.message })
  })

// message to interest users
exports.messageInterestedToTask = ({ params, body, user }, res) => Tasks
  .taskMessage(params, body, user)
  .then(data => res.send(data))
  .catch(error => {
    // eslint-disable-next-line no-console
    console.log('error on task controller message', error)
    res.send({ error: error.message })
  })

// Assigns functions.
exports.removeAssignedUser = (req, res) => {
  const params = { id: req.params.id, userId: req.user.id }
  Tasks
    .removeAssignedUser(params, req.body)
    .then(data => res.send(data))
    .catch(error => res.send({ error: error.message }))
}

exports.requestAssignedUser = (req, res) => {
  Tasks
    .requestAssignedUser.invite(req.body)
    .then(data => res.send(data))
    .catch(error => res.send({ error: error.message }))
}

exports.assignedUser = (req, res) => {
  Tasks
    .requestAssignedUser.confirm(req.body)
    .then(data => res.send(data))
    .catch(error => res.status(400).send({ error: error.message }))
}
