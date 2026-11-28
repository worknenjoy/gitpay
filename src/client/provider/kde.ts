import requestPromise from 'request-promise'

type KdeConnectProps = {
  uri: string
}

export const kdeBugUri = (bugId: string) => `https://bugs.kde.org/rest/bug/${bugId}`

export const kdeBugCommentsUri = (bugId: string) =>
  `https://bugs.kde.org/rest/bug/${bugId}/comment`

export const kdeStateToGitpay = (bug: { is_open?: boolean; status?: string } | null | undefined): string => {
  if (bug && typeof bug.is_open === 'boolean') {
    return bug.is_open ? 'open' : 'closed'
  }
  const status = (bug?.status || '').toUpperCase()
  if (['RESOLVED', 'VERIFIED', 'CLOSED'].includes(status)) return 'closed'
  return 'open'
}

export const KdeConnect = async ({ uri }: KdeConnectProps) => {
  const response = await requestPromise({
    uri,
    headers: {
      'User-Agent': 'gitpay',
      Accept: 'application/json'
    },
    json: true
  })

  return response
}
