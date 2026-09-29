import Models from '../../models'
import { fetchPullRequestFromUrl } from '../../modules/pullRequests/fetchPullRequestFromUrl'
import { verifyPullRequestAuthor } from '../../modules/pullRequests/verifyPullRequestAuthor'
import { verifyPullRequestMerged } from '../../modules/pullRequests/verifyPullRequestMerged'
import { searchUserPullRequests } from '../../modules/pullRequests/searchUserPullRequests'
import { postGitHubPullRequestComment } from '../../bot/postGitHubPullRequestComment'

const models = Models as any

export const resolvePullRequest = async (req: any, res: any) => {
  try {
    const { url } = req.query
    const pullRequest = await fetchPullRequestFromUrl(url)
    verifyPullRequestAuthor(req.user, pullRequest)
    verifyPullRequestMerged(pullRequest)

    res.status(200).send({
      repo: pullRequest.repo,
      number: pullRequest.number,
      title: pullRequest.title,
      state: pullRequest.state,
      url: pullRequest.url
    })
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('resolvePullRequest error on controller', error)
    const status = error.message === 'PULL_REQUEST_NOT_FOUND' ? 404 : 400
    res.status(status).send({ error: error.message })
  }
}

export const searchMyPullRequests = async (req: any, res: any) => {
  try {
    if (!req.user.provider_username) {
      throw new Error('GITHUB_ACCOUNT_NOT_LINKED')
    }

    const { repo } = req.query
    const rows = await searchUserPullRequests({ username: req.user.provider_username, repo })
    res.status(200).send(rows)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('searchMyPullRequests error on controller', error)
    res.status(400).send({ error: error.message })
  }
}

export const postPullRequestComment = async (req: any, res: any) => {
  try {
    const { paymentRequestId } = req.params
    const { commentBody } = req.body

    const paymentRequest = await models.PaymentRequest.findByPk(paymentRequestId, {
      include: [{ model: models.PaymentLinkType }]
    })

    if (!paymentRequest || paymentRequest.userId !== req.user.id) {
      return res.status(404).send({ error: 'PAYMENT_REQUEST_NOT_FOUND' })
    }
    if (paymentRequest.PaymentLinkType?.name !== 'pull_request' || !paymentRequest.url) {
      return res.status(422).send({ error: 'PAYMENT_REQUEST_NOT_A_PULL_REQUEST' })
    }

    // Unlike the automatic bot comments (issueAddedComment etc.), posting here is a deliberate,
    // explicit action the user confirmed by clicking "Post in pull request" — it should work
    // wherever they're testing it, not just in production.
    const userWithToken = await models.User.scope('withSensitive').findByPk(req.user.id)
    if (!userWithToken?.github_access_token) {
      return res.status(422).send({ error: 'GITHUB_WRITE_ACCESS_REQUIRED' })
    }

    const comment = await postGitHubPullRequestComment({
      pullRequestUrl: paymentRequest.url,
      commentBody,
      logContext: 'payment-request-pull-request',
      githubAccessToken: userWithToken.github_access_token
    })

    res.status(200).send(comment || { skipped: true })
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('postPullRequestComment error on controller', error)
    res.status(400).send({ error: error.message })
  }
}
