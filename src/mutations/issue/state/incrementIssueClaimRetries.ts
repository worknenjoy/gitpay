import Models from '../../../models'

const models = Models as any

export const incrementIssueClaimRetries = async (issueId: number) => {
  const issue = await models.Task.findByPk(issueId)

  if (!issue) {
    throw new Error(`Issue with id ${issueId} not found`)
  }

  const currentRetries = issue.claim_retries ?? 0
  await issue.update({ claim_retries: currentRetries + 1 })
  await issue.reload()
  return issue
}
