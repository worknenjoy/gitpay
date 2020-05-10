if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const router = express.Router()
const passport = require('passport')
const authenticationHelpers = require('../../authenticationHelpers')
require('../../../models')
const controllers = require('../controllers/auth')
const secure = require('./secure')

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

router.get('/authorize/github', passport.authenticate('github', { scope: ['user:email'], accessType: 'offline' }))
router.get('/callback/github',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_HOST}/#/token/${req.user.token}`)
  })

router.get('/authorize/bitbucket', passport.authenticate('bitbucket', { scope: ['email'], accessType: 'offline' }))
router.get('/callback/bitbucket',
  passport.authenticate('bitbucket', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_HOST}/#/token/` + req.user.token)
  })

router.post('/authorize/local', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      res.status(401)
      res.send({ 'reason': 'Invalid credentials' })
    }
    if (!user) {
      // res.status(401)
      // res.send({ 'reason': 'Invalid credentials' })
      res.redirect(`${process.env.FRONTEND_HOST}/#/login/invalid`)
    }
    else {
      req.logIn(user, { session: false }, (err) => {
        if (err) {
          res.status(500)
          res.send({ 'error': 'Server error' })
        }
        // set authorization header for tests
        res.set('Authorization', 'Bearer ' + user.token)
        res.redirect(`${process.env.FRONTEND_HOST}/#/token/${req.user.token}`)
      })
    }
  })(req, res, next)
})

router.get('/authorize/github/private', controllers.authorizeGithubPrivateIssue)

router.post('/auth/register', controllers.register)
router.get('/users', controllers.searchAll)
router.get('/callback/github/private', controllers.createPrivateTask)

router.use('/user/', secure)

router.get('/user/customer', controllers.customer)
router.get('/user/preferences', controllers.preferences)
router.get('/user/organizations', controllers.organizations)
router.put('/user/update', controllers.userUpdate)

router.post('/user/account', controllers.accountCreate)
router.get('/user/account', controllers.account)
router.put('/user/account', controllers.accountUpdate)

router.post('/user/bank_accounts', controllers.createBankAccount)
router.get('/user/bank_accounts', controllers.userBankAccount)

router.delete('/user/delete/:id', controllers.deleteUserById)

module.exports = router
