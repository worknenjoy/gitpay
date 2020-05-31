const Role = require('../../models').Role
const Promise = require('bluebird')

// eslint-disable-next-line no-undef
roleCreate = async (roleParameters) => {
  try {
    // console.log(roleParameters)
    let doc = await Role.findOne(
      {
        where:
            {
              userId: roleParameters.userId,
            //   name: { $or: ['', 'funder', 'contributor', 'maintainer'] }
            }
      }
    )
    if (!doc) {
      let createRole = {
        userId: roleParameters.userId,
        name: roleParameters.name,
        label: roleParameters.label,
      }
      //   console.log(createRole)
      let role = await Role.create(createRole)
      return role
    }
    else {
      // eslint-disable-next-line no-console
      console.log('Role exists')
      return false
    }
  }
  catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
  }
}
// eslint-disable-next-line no-undef
module.exports = Promise.method(roleCreate)
