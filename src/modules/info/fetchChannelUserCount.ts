const rp = require('request-promise')
const { slack } = require('../../config/secrets')

export async function fetchChannelUserCount(): Promise<number> {
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
