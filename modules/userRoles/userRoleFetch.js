/* eslint-disable no-console */
/* eslint-disable no-undef */
const UserRole = require('../../models').UserRole
const Promise = require('bluebird')

userRoleFetch = async (userRoleParameters) => {
  try {
    let role = await UserRole.findAll(
      {
        where:
            {
              userId: userRoleParameters.userId,
            }
      }
    )
    if (!role) {
      return { 'msg': 'User Role not found' }
    }
    else {
      return role
    }
  }
  catch (err) {
    console.log(err)
  }
}
module.exports = Promise.method(userRoleFetch)
