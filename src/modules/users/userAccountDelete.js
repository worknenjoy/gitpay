const Promise = require('bluebird')
const models = require('../../models')
const stripe = require('../shared/stripe/stripe')()

module.exports = Promise.method(async function userAccountDelete({ userId }) {
  const user = await models.User.findByPk(userId)
  const { account_id } = user

  const deletedAccount = await stripe.accounts.del(account_id)

  if (!deletedAccount.deleted) throw new Error('Failed to delete Stripe account')
  const userUpdated = await models.User.update(
    { account_id: null, country: null },
    { where: { id: userId }, returning: true },
  )

  if (!userUpdated[0]) throw new Error('Failed to update user')
  const updatedUser = await models.User.findByPk(userId, {
    include: [
      models.Type,
      {
        model: models.Organization,
        include: [
          {
            model: models.Project,
            include: [models.Task],
          },
        ],
      },
    ],
  })
  return updatedUser
})
