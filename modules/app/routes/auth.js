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

router.post('/authorize/local',
  passport.authenticate('local', {
    session: false,
    failureMessage: true,
    failureRedirect: `${process.env.FRONTEND_HOST}/#/signin/invalid`,
    // successRedirect: `${process.env.FRONTEND_HOST}/#/token/${req?.user?.token}`
  }),
  (req, res, next) => {
    res.set('Authorization', 'Bearer ' + req.user.token)
    res.redirect(`${process.env.FRONTEND_HOST}/#/token/${req.user.token}`)
  }
)

router.put('/auth/change-password', controllers.changePassword)

router.post('/auth/forgot-password', controllers.forgotPasswordNotification)

router.get('/authorize/github/private', controllers.authorizeGithubPrivateIssue)

router.post('/auth/register', controllers.register)
router.get('/auth/activate', controllers.activate_user)
router.get('/auth/resend-activation-email', controllers.resend_activation_email)
router.get('/users', controllers.searchAll)
router.get('/callback/github/private', controllers.createPrivateTask)

router.get('/users/types/:id', controllers.getUserTypes)

router.use('/user/', secure)

router.post('/user/customer', controllers.customerCreate)
router.get('/user/customer', controllers.customer)
router.put('/user/customer', controllers.customerUpdate)

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
