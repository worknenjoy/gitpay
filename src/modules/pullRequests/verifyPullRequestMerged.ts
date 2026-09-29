export function verifyPullRequestMerged(pullRequest: { state?: string }) {
  if (pullRequest.state !== 'merged') {
    throw new Error('PULL_REQUEST_NOT_MERGED')
  }
}

export default verifyPullRequestMerged
