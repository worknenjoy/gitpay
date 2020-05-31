const Role = require('../../models').Role
const Promise = require('bluebird')
const roleCreate = require('./roleCreate')

// eslint-disable-next-line no-undef
roleFetch = async (roleParameters) => {
  try {
    // console.log(roleParameters)
    let role = await Role.findOne(
      {
        where:
            {
              userId: roleParameters.userId,
            }
      }
    )
    if (!role) {
      // eslint-disable-next-line no-console
      console.log('role not found , creating a new role')
      return roleCreate(roleParameters)
      // if a new user joins , they wont have a role thus we define a blank role for the new user which later can get updated in the roleActions
    }
    else {
      return role
    }
  }
  catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
  }
}
// eslint-disable-next-line no-undef
module.exports = Promise.method(roleFetch)
