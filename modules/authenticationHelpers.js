/**
 * Authentication helpers to determine if a user is logged in or not
 * before a route returns information to the response
 */

const userExist = require('../modules/users').userExists
const jwt = require('jsonwebtoken')

function isAuthOrRedirect (req, res, next) {
  if (req.isAuthenticated()) return next()

  res.redirect('/')
}

function isNotAuthOrRedirect (req, res, next) {
  if (!req.isAuthenticated()) return next()

  res.redirect('/')
}

function isAuth (req, res, next) {
  // if (req.isAuthenticated()) return res.send({ 'authenticated': true });

  const token = req.headers.authorization.split(' ')[1]

  if (token) {
    return jwt.verify(token, process.env.SECRET_PHRASE, (err, decoded) => {
      // the 401 code is for unauthorized status
      if (err) {
        return res.status(401).end()
      }

      const userData = decoded
      // check if a user exists
      return userExist(userData).then(user => {
        return res.send({ authenticated: true, user: user })
      }).catch(e => {
        // eslint-disable-next-line no-console
        console.log('error to sign user')
        return res.status(401).end()
      })
    })
  }
  return next()
}

function isNotAuth (req, res, next) {
  if (!req.isAuthenticated()) return next()

  res.send({ 'authenticated': true })
}

module.exports = {
  isAuthOrRedirect: isAuthOrRedirect,
  isNotAuthOrRedirect: isNotAuthOrRedirect,
  isAuth: isAuth,
  isNotAuth: isNotAuth
}
