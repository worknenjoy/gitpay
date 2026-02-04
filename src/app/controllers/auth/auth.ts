import { userChangeEmail } from '../../../modules/users/userChangeEmail'
import { userConfirmChangeEmail } from '../../../modules/users/userConfirmChangeEmail'
const secrets = require('../../../config/secrets')
const user = require('../../../modules/users')
const passport = require('passport')

export const changeEmail = async (req: any, res: any) => {
  const userId = req.user.id
  const { newEmail, currentPassword, confirmCurrentPassword } = req.body

  try {
    const changeEmailParams = {
      userId,
      newEmail,
      currentPassword,
      confirmCurrentPassword
    }
    const data = await userChangeEmail(changeEmailParams)
    res.status(200).send(data)
  } catch (error: any) {
    console.log('error on request change email', error)
    res.status(500).json({ error: error.message || 'user.change_email.failed' })
  }
}

export const confirmChangeEmail = async (req: any, res: any) => {
  const { token } = req.query
  try {
    const data = await userConfirmChangeEmail({
      token
    })
    if (data) {
      res.redirect(`${process.env.FRONTEND_HOST}/#/signin/email-change-confirmed`)
    } else {
      res.redirect(`${process.env.FRONTEND_HOST}/#/signin/email-change-failed`)
    }
  } catch (error: any) {
    console.log('error on confirm change email', error)
    res.redirect(`${process.env.FRONTEND_HOST}/#/signin/email-change-failed`)
  }
}

export const authorizeGithubPrivateIssue = (req: any, res: any) => {
  const params = req.query
  const uri = encodeURIComponent(
    `${process.env.API_HOST}/callback/github/private?userId=${params.userId}&url=${params.url}`
  )
  res.redirect(
    `https://github.com/login/oauth/authorize?response_type=code&redirect_uri=${uri}&scope=repo&client_id=${secrets.github.id}`
  )
}

export const disconnectGithub = async (req: any, res: any) => {
  try {
    const data = await user.userDisconnectGithub({ userId: req.user.id })
    if (data) {
      res.redirect(`${process.env.FRONTEND_HOST}/#/profile/user-account/?disconnectAction=success`)
    } else {
      res.redirect(`${process.env.FRONTEND_HOST}/#/profile/user-account/?disconnectAction=error`)
    }
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.redirect(`${process.env.FRONTEND_HOST}/#/profile/user-account/?disconnectAction=error`)
  }
}

export const connectGithub = (req: any, res: any, next: any) => {
  const user = req.user
  if (user) {
    passport.authenticate('github', {
      scope: ['user:email'],
      state: req.user.email
    })(req, res, next)
  } else {
    res.redirect(`${process.env.FRONTEND_HOST}/#/signin/invalid`)
  }
}

export const authorizeLocal = (req: any, res: any, next: any) => {
  if (req.user && req.user.token) {
    res.set('Authorization', 'Bearer ' + req.user.token)
    res.redirect(`${process.env.FRONTEND_HOST}/#/token/${req.user.token}`)
  }
}
