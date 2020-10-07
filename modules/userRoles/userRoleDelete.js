/* eslint-disable no-console */
/* eslint-disable no-undef */
const UserRole = require('../../models').UserRole
const Promise = require('bluebird')

userRoleDelete = async (userRoleParameters) => {
  try {
    let role = await UserRole.destroy(
      {
        where:
            {
              userId: userRoleParameters.userId,
              name: userRoleParameters.name
            }
      }
    )
    if (!role) {
      console.log('role not found')
      return false
    }
    else {
      return true
    }
  }
  catch (err) {
    console.log(err)
  }
}
module.exports = Promise.method(userRoleDelete)
