import { findTaskSolutionsByUserId } from '../../queries/task/findTaskSolutionsByUserId'

export const listPublicTaskSolutions = async function listPublicTaskSolutions(req: any, res: any) {
  try {
    const userId = parseInt(req.params.userId, 10)
    if (!Number.isFinite(userId)) {
      return res.status(400).send({ message: 'A valid userId is required' })
    }

    const taskSolutions = await findTaskSolutionsByUserId(userId)
    return res.status(200).send(taskSolutions)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('listPublicTaskSolutions error on controller', error)
    res.status(error.StatusCodeError || 400).send(error)
  }
}
