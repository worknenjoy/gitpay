export function verifyPullRequestAuthor(user: any, pullRequest: { authorLogin?: string }) {
  if (!user?.provider_username) {
    throw new Error('GITHUB_ACCOUNT_NOT_LINKED')
  }
  // GitHub usernames are case-insensitive; compare that way so a casing difference between
  // when we stored provider_username and how GitHub returns the PR author's login (or a
  // username the account was renamed to) doesn't cause a false rejection.
  const viewerUsername = String(user.provider_username).trim().toLowerCase()
  const authorUsername = String(pullRequest.authorLogin || '')
    .trim()
    .toLowerCase()
  if (!authorUsername || viewerUsername !== authorUsername) {
    throw new Error('PULL_REQUEST_NOT_AUTHORED_BY_USER')
  }
}

export default verifyPullRequestAuthor
