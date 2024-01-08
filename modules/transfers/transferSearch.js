const Promise = require('bluebird')
const Transfer = require('../../models').Transfer

module.exports = Promise.method(async function transferSearch(params = {}) {
  const transfers = await Transfer.findAll({where: params})
  console.log('transfer on modulle', transfers)
  return transfers
})
