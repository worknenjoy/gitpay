/* eslint-disable no-console */
/* eslint-disable no-undef */
const UserRoles = require('../../userRoles')
/*
 * GET @ /roles/fetch
 *
 */
exports.fetchUserRole = async (req, res) => {
  try {
    req.body.userId = req.user.id
    let doc = await UserRoles.userRoleFetch(req.body)
    if (doc) {
      console.log('found role', doc)
      return res.status(200).send(doc)
    }
  }
  catch (err) {
    console.log(err)
    return res.status(500).send(false)
  }
}
/*
 * POST @ /roles/create
 *
 */
exports.createUserRole = async (req, res) => {
  try {
    req.body.userId = req.user.id
    let doc = await UserRoles.userRoleCreate(req.body)
    if (doc) {
      console.log('role created', doc)
      return res.status(201).send(doc)
    }
  }
  catch (err) {
    console.log(err)
    return res.status(500).send(false)
  }
}
/*
 * DELETE @ /roles/delete
 *
 */
exports.deleteUserRole = async (req, res) => {
  try {
    req.body.userId = req.user.id
    let doc = await UserRoles.userRoleDelete(req.body)
    if (doc) {
      console.log('role deleted')
      return res.status(200).send({ 'msg': 'ok' })
    }
  }
  catch (err) {
    console.log(err)
    return res.status(500).send(false)
  }
}
