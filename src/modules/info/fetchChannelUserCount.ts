const rp = require('request-promise')
const { slack } = require('../../config/secrets')

export async function fetchChannelUserCount(): Promise<number> {
  // Without a token/channel there's nothing to look up — and, worse, request-promise's
  // proxy-tunneling path can emit a raw socket 'error' event for a failed connection that
  // bypasses this function's own try/catch entirely, crashing the whole process (this is
  // hit on every public page load via the footer's GET /info/all). Skip the network call
  // outright when Slack isn't configured, which is the common case outside production.
  if (!slack.token || !slack.channelId) {
    return 0
  }

  const data = await rp({
    uri: 'https://slack.com/api/conversations.list',
    headers: { Authorization: 'Bearer ' + slack.token },
    json: true
  })
  if (data.ok) {
    const channel = data.channels.find((c: any) => c.id === slack.channelId)
    if (!channel) {
      console.error('Invalid channel id ' + slack.channelId)
      return 0
    }
    return channel.num_members
  }
  return 0
}
