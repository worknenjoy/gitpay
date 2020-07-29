const Role = require('../../models').Role
const Promise = require('bluebird')

// eslint-disable-next-line no-undef
roleUpdate = async (roleParameters) => {
  try {
    // eslint-disable-next-line no-console
    console.log(roleParameters)
    let doc = await Role.update(
      {
        name: roleParameters.name,
        label: roleParameters.label
      },
      {
        where:
            {
              userId: roleParameters.userId
            }
      }
    )
    if (!doc) {
      // eslint-disable-next-line no-console
      console.log('role not found')
      return false
    }
    else {
    // return doc;  returns [1]
      return await Role.findOne({ where: { userId: roleParameters.userId } })
    // return tthe update doc because the roleAction function requires json {name:'<something_here>'} and not [1]
    }
  }
  catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
  }
}
// eslint-disable-next-line no-undef
module.exports = Promise.method(roleUpdate)
