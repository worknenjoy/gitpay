import * as Tasks from '../../modules/tasks'

export const getTaskSolution = async (req: any, res: any) => {
  try {
    const data = await Tasks.taskSolutionGet(req.query.taskId, req.user.id)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('taskSolutionGet error on controller', error)
    res.status(error.StatusCodeError || 400).send({ error: error.message })
  }
}

export const fetchPullRequestData = async (req: any, res: any) => {
  try {
    const params = {
      pullRequestId: req.query.pullRequestId,
      userId: req.user.id,
      repositoryName: req.query.repositoryName,
      owner: req.query.owner,
      taskId: req.query.taskId
    }
    const data = await Tasks.taskSolutionFetchData(params)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('taskSolutionFetchData error on controller', error)
    res.status(error.StatusCodeError || 400).send({ error: error.message })
  }
}

export const createTaskSolution = async (req: any, res: any) => {
  try {
    const data = await Tasks.taskSolutionCreate({ ...req.body, userId: req.user.id })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('taskSolutionCreate error on controller', error)
    res.status(error.StatusCodeError || 400).send({ error: error.message })
  }
}

export const updateTaskSolution = async (req: any, res: any) => {
  try {
    const data = await Tasks.taskSolutionUpdate({ ...req.body, userId: req.user.id }, req.params.id)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('taskSolutionUpdate error on controller', error)
    res.status(error.StatusCodeError || 400).send({ error: error.message })
  }
}
