/* eslint-disable no-console */
/* eslint-disable no-undef */
const UserRole = require('../../models').UserRole
const Promise = require('bluebird')

userRoleCreate = async (userRoleParameters) => {
  try {
    let doc = await UserRole.findOne(
      {
        where:
            {
              userId: userRoleParameters.userId,
              name: userRoleParameters.name
            }
      }
    )
    if (!doc) {
      let createRole = {
        userId: userRoleParameters.userId,
        name: userRoleParameters.name,
      }
      let role = await UserRole.create(createRole)
      return role
    }
    else {
      console.log('Role exists')
      return false
    }
  }
  catch (err) {
    console.log(err)
  }
}
module.exports = Promise.method(userRoleCreate)
