if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const router = express.Router()
const passport = require('passport')
const authenticationHelpers = require('../../authenticationHelpers')
require('../../../loading/loading')
const controllers = require('../controllers/auth')

router.get('/authenticated', authenticationHelpers.isAuth)

router.get('/authorize/google', passport.authenticate('google', { scope: ['email'], accessType: 'offline' }))
router.get('/callback/google', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/signin'
}))

router.get('/authorize/facebook', passport.authenticate('facebook', { scope: ['email'], accessType: 'offline' }))
router.get('/callback/facebook', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/signin'
}))

router.get('/authorize/github', passport.authenticate('github', { scope: ['email'], accessType: 'offline' }))
router.get('/callback/github',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_HOST}/#/token/` + req.user.token)
  })

router.get('/authorize/bitbucket', passport.authenticate('bitbucket', { scope: ['email'], accessType: 'offline' }))
router.get('/callback/bitbucket',
  passport.authenticate('bitbucket', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_HOST}/#/token/` + req.user.token)
  })

router.post('/authorize/local', (req, res, next) => {
  passport.authenticate('local', (user) => {
    if (!user) {
      res.status(401)
      res.send({ 'reason': 'Invalid credentials' })
    }
    else {
      req.logIn(user, (err) => {
        if (err) {
          res.status(500)
          res.send({ 'error': 'Server error' })
        }
        res.send(user)
      })
    }
  })(req, res, next)
})

router.post('/auth/register', controllers.register)
router.get('/users', controllers.searchAll)
router.get('/user/customer', controllers.customer)
router.get('/users/:id/account', controllers.account)
router.post('/user/account', controllers.accountCreate)
router.put('/user/account', controllers.accountUpdate)
router.post('/user/bank_accounts', controllers.createBankAccount)
router.get('/users/:id/bank_accounts', controllers.userBankAccount)

module.exports = router
