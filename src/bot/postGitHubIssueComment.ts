import requestPromise from 'request-promise'
import { parseAndValidateIssueUrl } from '../utils/issue/parse-and-validate-issue-url'

const githubApiEndpoint = 'https://api.github.com'
const defaultFrontendHost = 'https://gitpay.me'

type PostGitHubIssueCommentParams = {
  issueUrl: string
  commentBody: string
  logContext: string
}

type GitHubIssueCommentResponse = {
  id: number
  html_url: string
  body: string
}

type ClosedBountyReminderBodyParams = {
  taskId: number | string
  githubIssueNumber: string
  amount?: string | number | null
  githubUsername?: string | null
}

function getFrontendHost() {
  return (process.env.FRONTEND_HOST || defaultFrontendHost).replace(/\/+$/, '')
}

function getTaskUrl(taskId: number | string) {
  return `${getFrontendHost()}/#/task/${taskId}`
}

function formatGithubMention(githubUsername?: string | null) {
  if (!githubUsername || !/^[A-Za-z0-9-]+$/.test(githubUsername)) return ''
  return `@${githubUsername}`
}

export function isGitHubCommentingEnabled(provider?: string | null) {
  return provider === 'github' && process.env.NODE_ENV === 'production'
}

export function getGitHubIssueContext(issueUrl: string) {
  const { userOrCompany, projectName, issueId } = parseAndValidateIssueUrl(issueUrl, 'github')

  return {
    owner: userOrCompany,
    repo: projectName,
    issueNumber: issueId
  }
}

export function buildIssueAddedCommentBody(taskId: number | string) {
  return `GitPay linked this issue to task #${taskId}.\n\nView the task: ${getTaskUrl(taskId)}`
}

export function buildBountyAddedCommentBody(params: {
  taskId: number | string
  amount?: string | number | null
  currency?: string | null
}) {
  const amount = params.amount ?? 0
  const currency = params.currency || 'USD'

  return `GitPay recorded a bounty of ${amount} ${currency} for this issue.\n\nView the task: ${getTaskUrl(params.taskId)}`
}

export function buildClosedBountyReminderBody({
  taskId,
  githubIssueNumber,
  amount,
  githubUsername
}: ClosedBountyReminderBodyParams) {
  const mention = formatGithubMention(githubUsername)
  const greeting = mention ? `${mention}\n\n` : ''
  const normalizedAmount = amount ?? 0

  return `${greeting}GitPay shows this issue as closed with an unpaid bounty of $${normalizedAmount}.\n\nIf your pull request for issue #${githubIssueNumber} was merged, claim the bounty here:\n${getTaskUrl(taskId)}`
}

export async function postGitHubIssueComment({
  issueUrl,
  commentBody,
  logContext
}: PostGitHubIssueCommentParams) {
  const githubToken = process.env.GITHUB_BOT_ACCESS_TOKEN

  if (!githubToken) {
    console.log(`[GitHub bot] Skipping ${logContext} comment: missing GITHUB_BOT_ACCESS_TOKEN`)
    return
  }

  const { owner, repo, issueNumber } = getGitHubIssueContext(issueUrl)
  const commentIssueEndpoint = `${githubApiEndpoint}/repos/${owner}/${repo}/issues/${issueNumber}/comments`

  try {
    const response = (await requestPromise({
      method: 'POST',
      uri: commentIssueEndpoint,
      headers: {
        'User-Agent': 'gitpaybot',
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        Authorization: 'token ' + githubToken,
        'X-GitHub-Api-Version': '2022-11-28'
      },
      json: true,
      body: {
        body: commentBody
      }
    })) as GitHubIssueCommentResponse

    console.log(`[GitHub bot] Posted ${logContext} comment`, {
      id: response.id,
      html_url: response.html_url
    })

    return response
  } catch (error) {
    console.log(`[GitHub bot] Error posting ${logContext} comment`, error)
  }
}
