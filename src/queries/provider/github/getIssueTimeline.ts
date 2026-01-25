import url from 'url'
import { GithubConnect } from '../../../client/provider/github'

export const getIssueTimeline = async (issueUrl: string) => {
  const splitIssueUrl = url.parse(issueUrl).path?.split('/')
  const owner = splitIssueUrl ? splitIssueUrl[1] : ''
  const repo = splitIssueUrl ? splitIssueUrl[2] : ''
  const issueNumber = splitIssueUrl ? splitIssueUrl[4] : ''

  if (!owner || !repo || !issueNumber) {
    throw new Error('Invalid GitHub issue URL')
  }
  const issueUrlFormatted = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/timeline`
  const issueTimeline = await GithubConnect({ uri: issueUrlFormatted })
  return issueTimeline
}
