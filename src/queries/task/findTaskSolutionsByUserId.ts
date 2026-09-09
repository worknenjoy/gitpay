import Models from '../../models'

const models = Models as any

/**
 * Public-safe list of a user's submitted pull requests (TaskSolutions).
 * Attribute set is deliberately narrow — do not widen the Task include
 * beyond what's safe to show on a public profile.
 */
export const findTaskSolutionsByUserId = async (userId: number) => {
  return models.TaskSolution.findAll({
    where: { userId },
    attributes: ['id', 'pullRequestURL', 'isPRMerged', 'isIssueClosed', 'createdAt'],
    include: [
      {
        model: models.Task,
        attributes: ['id', 'title', 'url', 'status']
      }
    ],
    order: [['createdAt', 'DESC']]
  })
}
