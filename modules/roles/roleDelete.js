const Role = require('../../models').Role
const Promise = require('bluebird')

// eslint-disable-next-line no-undef
roleDelete = async (roleParameters) => {
  try {
    let role = await Role.destroy(
      {
        where:
            {
              userId: roleParameters.userId
            }
      }
    )
    if (!role) {
      // eslint-disable-next-line no-console
      console.log('role not found')
      return false
    }
    else {
      return true
    }
  }
  catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
  }
}
// eslint-disable-next-line no-undef
module.exports = Promise.method(roleDelete)
