import http from 'http'

const PORT = 4311

/**
 * Fakes just enough of GitHub's REST API for import-pull-request.spec.ts to resolve a pull
 * request without depending on the real, unauthenticated api.github.com (60 requests/hour,
 * shared across CI's whole IP pool — flaky for reasons that have nothing to do with this
 * repo). fetchPullRequestFromUrl.ts already resolves its base URL from
 * GITHUB_API_BASE_URL (see that file), so pointing that env var at this server (see
 * playwright.config.js) requires no other production code changes.
 *
 * Only the two PRs the spec actually resolves are canned; the pasted PR URL's owner/repo/
 * number no longer need to correspond to anything real on GitHub.
 */
const PULL_REQUESTS: Record<string, { title: string; login: string }> = {
  '8': { title: 'Home react', login: 'alexanmtz' },
  '15': { title: 'Release candidate - task orders login redux prod', login: 'alexanmtz' }
}

function send(res: http.ServerResponse, status: number, body: unknown) {
  const json = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(json)
  })
  res.end(json)
}

const server = http.createServer((req, res) => {
  const path = (req.url || '').split('?')[0]
  const match = path.match(/^\/repos\/([^/]+)\/([^/]+)\/pulls\/(\d+)$/)

  if (req.method === 'GET' && match) {
    const [, owner, repo, number] = match
    const pullRequest = PULL_REQUESTS[number]

    if (!pullRequest) {
      return send(res, 404, { message: 'Not Found' })
    }

    return send(res, 200, {
      title: pullRequest.title,
      html_url: `https://github.com/${owner}/${repo}/pull/${number}`,
      state: 'closed',
      merged: true,
      user: { login: pullRequest.login }
    })
  }

  // eslint-disable-next-line no-console
  console.log(`[github-stub] unhandled ${req.method} ${path}`)
  return send(res, 404, { message: 'Not Found' })
})

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`GitHub stub server listening on port ${PORT}`)
})
