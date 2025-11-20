const models = require('../../models')
const Promise = require('bluebird')

module.exports = Promise.method(async function payoutBuilds(params) {
  if (!params.userId) {
    return { error: 'No userId' }
  }

  const existingPayout =
    params.source_id &&
    (await models.Payout.findOne({
      where: {
        source_id: params.source_id,
      },
    }))

  if (existingPayout) {
    return { error: 'This payout already exists' }
  }

  const payout = await models.Payout.build({
    source_id: params.source_id,
    userId: params.userId,
    amount: params.amount,
    currency: params.currency,
    method: params.method,
    status: params.status,
  })

  const newPayout = await payout.save()

  return newPayout
})
