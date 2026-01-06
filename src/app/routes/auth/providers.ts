import express from 'express'
import passport from 'passport'
import * as authenticationHelpers from '../../../modules/authenticationHelpers'
import * as controllers from '../../controllers/auth'
import secure from '../secure'

const router = express.Router()

router.get('/authenticated', authenticationHelpers.isAuth)

router.get(
  '/authorize/google',
  passport.authenticate('google', { scope: ['email'] })
)
router.get(
  '/callback/google',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/signin'
  })
)

router.get(
  '/authorize/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
)
router.get(
  '/callback/facebook',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/signin'
  })
)

router.get(
  '/authorize/github',
  passport.authenticate('github', { scope: ['user:email'] })
)

router.get(
  '/callback/github',
  passport.authenticate('github', { failureRedirect: `/` }),
  (req: any, res: any) => {
    const user = req.user
    if (user.token) {
      if (user.login_strategy === 'local' || user.login_strategy === null) {
        res.redirect(
          `${process.env.FRONTEND_HOST}/#/profile/user-account/?connectGithubAction=success`
        )
      } else {
        res.redirect(`${process.env.FRONTEND_HOST}/#/token/${user.token}`)
      }
    }
  }
)

router.get('/callback/github/private', controllers.createPrivateTask)

router.get('/connect/github', secure, (req: any, res:any, next: any) => {
  const user = req.user
  if (user) {
    passport.authenticate('github', {
      scope: ['user:email'],
      state: req.user.email
    })(req, res, next)
  } else {
    res.redirect(`${process.env.FRONTEND_HOST}/#/signin/invalid`)
  }
})

router.get('/authorize/github/private', controllers.authorizeGithubPrivateIssue)
router.get('/authorize/github/disconnect', secure, controllers.disconnectGithub)

router.get(
  '/authorize/bitbucket',
  passport.authenticate('bitbucket', { scope: ['email'] })
)
router.get(
  '/callback/bitbucket',
  passport.authenticate('bitbucket', { failureRedirect: '/' }),
  (req: any, res: any) => {
    res.redirect(`${process.env.FRONTEND_HOST}/#/token/` + req.user.token)
  }
)

router.post(
  '/authorize/local',
  passport.authenticate('local', {
    session: false,
    failureMessage: true,
    failureRedirect: `${process.env.FRONTEND_HOST}/#/signin/invalid`
    // successRedirect: `${process.env.FRONTEND_HOST}/#/token/${req?.user?.token}`
  }),
  (req: any, res: any, next: any) => {
    res.set('Authorization', 'Bearer ' + req.user.token)
    res.redirect(`${process.env.FRONTEND_HOST}/#/token/${req.user.token}`)
  }
)

export default router
