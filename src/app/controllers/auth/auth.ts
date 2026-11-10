import { userChangeEmail } from '../../../modules/users/userChangeEmail'
import { userConfirmChangeEmail } from '../../../modules/users/userConfirmChangeEmail'
import userDisconnectGithub from '../../../modules/users/userDisconectGithub'
import secrets from '../../../config/secrets'
import passport from 'passport'
import { signPrivateTaskState } from '../../../utils/auth/privateTaskState'
import { parseAndValidateIssueUrl } from '../../../utils/issue/parse-and-validate-issue-url'
import { omitAuthSecrets } from '../../../queries/user/userSensitiveAttributes'

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
    res.status(200).send(omitAuthSecrets(data))
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
  const userId = req.user?.id
  const issueUrl = typeof req.query?.url === 'string' ? req.query.url : ''

  if (!userId) {
    return res.status(403).json({ errors: ['Failed to authenticate user'] })
  }

  try {
    parseAndValidateIssueUrl(issueUrl, 'github')
  } catch (error: any) {
    return res.status(400).json({ error: error?.message || 'Invalid GitHub issue URL' })
  }

  const state = signPrivateTaskState({ userId, url: issueUrl })
  const uri = encodeURIComponent(`${process.env.API_HOST}/callback/github/private`)
  return res.redirect(
    `https://github.com/login/oauth/authorize?response_type=code&redirect_uri=${uri}&scope=${encodeURIComponent('repo,user:email')}&client_id=${secrets.github.id}&state=${encodeURIComponent(state)}`
  )
}

export const disconnectGithub = async (req: any, res: any) => {
  try {
    const data = await userDisconnectGithub({ userId: req.user.id })
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
      // public_repo: needed to post comments as the user on public repos (Import Pull Request).
      scope: ['user:email', 'public_repo'],
      state: req.user.email
    })(req, res, next)
  } else {
    res.redirect(`${process.env.FRONTEND_HOST}/#/signin/invalid`)
  }
}

export const authorizeLocal = (req: any, res: any, next: any) => {
  const rememberMe = req.rememberMe
  if (req.user && req.user.token) {
    res.set('Authorization', 'Bearer ' + req.user.token)
    if (rememberMe ?? false) {
      res.setCookie('rememberMe', req.user.token)
    }
    res.redirect(`${process.env.FRONTEND_HOST}/#/token/${req.user.token}`)
  }
}
