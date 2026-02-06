import express from 'express'
import passport from 'passport'
import * as authenticationHelpers from '../../../utils/auth/authenticationHelpers'
import {
  authorizeGithubPrivateIssue,
  disconnectGithub,
  connectGithub,
  authorizeLocal
} from '../../controllers/auth/auth'
import { callbackGithub, callbackBitbucket } from '../../controllers/auth/callbacks'
import { createPrivateTask } from '../../controllers/user/user'
import secure from '../secure'

const router = express.Router()

router.get('/authenticated', authenticationHelpers.isAuth)

router.get('/authorize/google', passport.authenticate('google', { scope: ['email'] }))
router.get(
  '/callback/google',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/signin'
  })
)

router.get('/authorize/facebook', passport.authenticate('facebook', { scope: ['email'] }))
router.get(
  '/callback/facebook',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/signin'
  })
)

router.get('/authorize/github', passport.authenticate('github', { scope: ['user:email'] }))

router.get(
  '/callback/github',
  passport.authenticate('github', { failureRedirect: `/` }),
  callbackGithub
)

router.get('/callback/github/private', createPrivateTask)

router.get('/connect/github', secure, connectGithub)

router.get('/authorize/github/private', authorizeGithubPrivateIssue)
router.get('/authorize/github/disconnect', secure, disconnectGithub)

router.get('/authorize/bitbucket', passport.authenticate('bitbucket', { scope: ['email'] }))
router.get(
  '/callback/bitbucket',
  passport.authenticate('bitbucket', { failureRedirect: '/' }),
  callbackBitbucket
)

router.post(
  '/authorize/local',
  passport.authenticate('local', {
    session: false,
    failureMessage: true,
    failureRedirect: `${process.env.FRONTEND_HOST}/#/signin/invalid`
    // successRedirect: `${process.env.FRONTEND_HOST}/#/token/${req?.user?.token}`
  }),
  authorizeLocal
)

export default router
