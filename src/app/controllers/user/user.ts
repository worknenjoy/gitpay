import userInfo from '../../../modules/users/userInfo'
import userUpdate from '../../../modules/users/userUpdate'
const crypto = require('crypto')
const requestPromise = require('request-promise')
const secrets = require('../../../config/secrets')
const user = require('../../../modules/users')
const models = require('../../../models')
const task = require('../../../modules/tasks')
const Sendmail = require('../../../modules/mail/mail')
const UserMail = require('../../../modules/mail/user')

export const getUserInfo = async (req: any, res: any) => {
  const userId = req.user.id
  try {
    const info = await userInfo({ userId })
    res.status(200).json(info)
  } catch (error) {
    console.error('Error fetching user info:', error)
    res.status(500).send('Error fetching user info')
  }
}

export const updateUser = (req: any, res: any) => {
  req.body.id = req.user.id
  userUpdate(req.body)
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      const message =
        error instanceof Error ? error.message : String(error ?? 'Error updating user')
      const status = message === 'user.email.exists' ? 409 : 500
      res.status(status).json({ error: message })
    })
}

export const register = async (req: any, res: any) => {
  const { email, name, password } = req.body
  if (name?.length > 72) return res.status(401).send({ message: 'user.name.too.long' })
  if (email?.length > 72) return res.status(401).send({ message: 'user.email.too.long' })
  if (password?.length > 72) return res.status(401).send({ message: 'user.password.too.long' })
  try {
    const userData = await user.userExists({ email })
    if (userData.dataValues && userData.dataValues.email) {
      res.status(403).send({ message: 'user.exist' })
      return
    }
    try {
      const data = await user.userBuilds(req.body)
      res.send(data)
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    }
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const forgotPasswordNotification = async (req: any, res: any) => {
  const { email } = req.body
  try {
    const foundUser = await user.userExists({ email })
    if (foundUser.dataValues && foundUser.dataValues.email) {
      const token = models.User.generateToken()
      await models.User.update({ recover_password_token: token }, { where: { email } })
      const url = `${process.env.FRONTEND_HOST}/#/reset-password/${token}`
      const html = `<p>Hi ${foundUser.dataValues.name || 'Gitpay user'},</p><p>Click <a href="${url}">here</a> to reset your password.</p>`
      const subject = 'Reset Password'
      const message = {
        to: foundUser.dataValues,
        subject,
        html
      }
      Sendmail.success(message.to, message.subject, message.html)
      res.send(true)
    } else {
      res.status(403).send({ message: 'user.not.exist' })
    }
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const resetPassword = async (req: any, res: any) => {
  try {
    const foundUser = await models.User.findOne({
      where: { recover_password_token: req.body.token }
    })
    if (!foundUser) res.status(401)
    const passwordHash = models.User.generateHash(req.body.password)
    if (passwordHash) {
      await models.User.update(
        { password: passwordHash, recover_password_token: null },
        { where: { id: foundUser.dataValues.id } }
      )
      res.send('successfully change password')
    } else {
      res.status(401).send({ message: 'user.no.password.reset' })
    }
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const changePassword = async (req: any, res: any) => {
  try {
    const data = await user.userChangePassword({ ...req.body, id: req.user.id })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.status(400).send({ error: error.message })
  }
}

export const createPrivateTask = async (req: any, res: any) => {
  const { url, code, userId } = req.query
  const githubClientId = secrets.github.id
  const githubClientSecret = secrets.github.secret
  try {
    const response = await requestPromise({
      method: 'POST',
      uri: 'https://github.com/login/oauth/access_token/',
      headers: {
        'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0',
        Authorization:
          'Basic ' + Buffer.from(`${githubClientId}:${githubClientSecret}`).toString('base64')
      },
      body: {
        code
      },
      json: true
    })
    if (response.access_token) {
      try {
        const taskResult = await task.taskBuilds({
          provider: 'github',
          private: true,
          userId,
          url,
          token: response.access_token
        })
        res.redirect(`${process.env.FRONTEND_HOST}/#/task/${taskResult.id}`)
        // return res.send(data)
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log('Error on import private task', error)
        const errorStatus =
          error?.error?.status ??
          error?.status ??
          error?.statusCode ??
          error?.response?.status ??
          error?.response?.statusCode
        const errorMessage = error?.message || error?.error?.message
        const isRateLimit =
          String(errorStatus) === '403' || /rate limit exceeded/i.test(errorMessage || '')
        const finalError = isRateLimit ? 'API limit reached, please try again later.' : errorMessage
        const encodedError = encodeURIComponent(finalError || 'We could not import the issue.')
        return res.redirect(
          `${process.env.FRONTEND_HOST}/#/profile?createTaskError=true&message=${encodedError}`
        )
      }
    }
    return res.status(response.access_token ? 200 : 401).send(response)
  } catch (e: any) {
    return res.status(401).send(e)
  }
}

export const activateUser = async (req: any, res: any) => {
  const { token, userId } = req.query
  try {
    const foundUser = await models.User.findOne({ where: { activation_token: token, id: userId } })
    if (!foundUser) {
      res.status(401).send({ message: 'user.not.exist' })
    } else {
      const userUpdate = await models.User.update(
        { activation_token: null, email_verified: true },
        { where: { id: foundUser.dataValues.id }, returning: true, plain: true }
      )
      res.send(userUpdate[1])
    }
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.status(401).send(error)
  }
}

export const resendActivationEmail = async (req: any, res: any) => {
  const { id: userId } = req.user
  try {
    const foundUser = await models.User.findOne({ where: { id: userId } })
    if (!foundUser) res.status(401)
    const { id, name } = foundUser.dataValues
    const token = models.User.generateToken()
    const userUpdate =
      token &&
      (await models.User.update(
        { activation_token: token, email_verified: false },
        { where: { id: foundUser.dataValues.id }, returning: true, plain: true }
      ))
    if (userUpdate[1].dataValues.id) {
      UserMail.activation(userUpdate[1].dataValues, token)
    }
    res.send(userUpdate[1])
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
}

export const preferences = async (req: any, res: any) => {
  try {
    const data = await user.userPreferences({ id: req.user.id })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const organizations = async (req: any, res: any) => {
  try {
    const data = await user.userOrganizations({ id: req.user.id })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const userFetch = async (req: any, res: any) => {
  const userId = req.user.id
  try {
    const data = await user.userFetch(userId)
    res.status(200).send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.status(400).send(error)
  }
}

export const deleteUserById = async (req: any, res: any) => {
  const params = { id: req.user.id }
  try {
    const deleted = await user.userDeleteById(params)
    res.status(200).send(`${deleted}`)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.status(400).send(error)
  }
}
