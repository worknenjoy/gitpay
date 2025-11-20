const Promise = require('bluebird')
const models = require('../../models')

module.exports = Promise.method(async function payoutSearch(params = {}) {
  let payouts = []
  if (params.userId) {
    payouts = await models.Payout.findAll({
      where: { userId: params.userId },
      include: [models.User],
    })
  }
  return payouts
})
