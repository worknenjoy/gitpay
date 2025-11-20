const { at } = require('core-js/core/string')
const models = require('../../models')
const Promise = require('bluebird')

module.exports = Promise.method(async function userTypes(userId) {
  return models.User.findOne({
    where: {
      id: userId
    },
    include: [
      {
        model: models.Type,
        as: 'Types',
        attributes: ['id', 'name']
      }
    ],
    attributes: ['id', 'name', 'profile_url', 'picture_url', 'website']
  })
    .then(async (user) => {
      if (!user) {
        return {}
      }
      return user
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error on user types', error)
      throw error
    })
})
