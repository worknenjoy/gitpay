const Tasks = require('../../tasks')

exports.createTask = (req, res) => {
  Tasks.taskBuilds(req.body)
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(error)
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
  Tasks.taskDeleteById(req.params)
    .then(() => {
      res.sendStatus(200)
    }).catch(error => {
      res.status(400).send(error)
    })
}

// invite functions
exports.inviteUserToTask = ({ params, body }, res) => Tasks
  .taskInvite(params, body)
  .then(data => res.send(data))
  .catch(error => res.send({ error: error.message }))

// Assigns functions.
exports.removeAssignedUser = ({ params, body }, res) => Tasks
  .removeAssignedUser(params, body)
  .then(data => res.send(data))
  .catch(error => res.send({ error: error.message }))
