const Tasks = require('../../tasks')

exports.getTaskSolution = (req, res) => {
  Tasks.taskSolutionGet(req.query.taskId, req.query.userId)
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('taskSolutionGet error on controller', error)
      res.status(error.StatusCodeError || 400).send({ error: error.message })
    })
}

exports.fetchPullRequestData = (req, res) => {
  const params = {
    pullRequestId: req.query.pullRequestId,
    userId: req.query.userId,
    repositoryName: req.query.repositoryName,
    owner: req.query.owner,
    taskId: req.query.taskId
  }
  Tasks.taskSolutionFetchData(params)
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('taskSolutionFetchData error on controller', error)
      res.status(error.StatusCodeError || 400).send({ error: error.message })
    })
}

exports.createTaskSolution = (req, res) => {
  Tasks.taskSolutionCreate(req.body)
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('taskSolutionCreate error on controller', error)
      res.status(error.StatusCodeError || 400).send({ error: error.message })
    })
}

exports.updateTaskSolution = (req, res) => {
  Tasks.taskSolutionUpdate(req.body, req.params.id).then(data => {
    res.send(data)
  }).catch(error => {
    // eslint-disable-next-line no-console
    console.log('taskSolutionUpdate error on controller', error)
    res.status(error.StatusCodeError || 400).send({ error: error.message })
  })
}
