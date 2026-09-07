import userInfo from '../../../modules/users/userInfo'
import userUpdate from '../../../modules/users/userUpdate'
import requestPromise from 'request-promise'
import secrets from '../../../config/secrets'
import * as user from '../../../modules/users'
import Models from '../../../models'
import * as task from '../../../modules/tasks'
import Sendmail from '../../../mail/mail'
import UserMail from '../../../mail/user'
import i18n from 'i18n'

const models = Models as any

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
      i18n.setLocale(foundUser.dataValues.language || 'en')
      const html = i18n.__('mail.user.forgotPassword.message', {
        name: foundUser.dataValues.name || 'Gitpay user',
        url
      })
      const subject = i18n.__('mail.user.forgotPassword.subject')
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
  const redirectPrivateTaskError = (message?: string) => {
    const encodedError = encodeURIComponent(message || 'We could not import the issue.')
    return res.redirect(
      `${process.env.FRONTEND_HOST}/#/profile?createTaskError=true&message=${encodedError}`
    )
  }
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
        return redirectPrivateTaskError(finalError)
      }
    }
    return redirectPrivateTaskError(response?.error_description || response?.error)
  } catch (e: any) {
    return redirectPrivateTaskError(e?.message || e?.error?.message)
  }
}

const RESEND_ACTIVATION_COOLDOWN_MS = 60 * 1000
const ACTIVATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000

// Read-only status check, safe to call automatically on page load: it never touches
// activation_token, so it can't be used to burn a single-use link the way activateUser can.
export const getActivationStatus = async (req: any, res: any) => {
  const { userId } = req.query
  try {
    const foundUser = await models.User.findOne({ where: { id: userId } })
    if (!foundUser) {
      res.status(401).send({ message: 'user.not.exist' })
      return
    }
    res.send({ email_verified: !!foundUser.dataValues.email_verified })
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('[activation] status check error', error)
    res.status(500).send({ message: 'user.activation.status.error' })
  }
}

export const activateUser = async (req: any, res: any) => {
  const { token, userId } = req.query
  try {
    const foundUser = await models.User.findOne({ where: { id: userId } })
    if (!foundUser) {
      // eslint-disable-next-line no-console
      console.log(`[activation] activate failed: no user for id ${userId}`)
      res.status(401).send({ message: 'user.not.exist' })
      return
    }

    if (foundUser.dataValues.email_verified) {
      // eslint-disable-next-line no-console
      console.log(`[activation] activate no-op: user ${userId} already verified`)
      res.send(foundUser)
      return
    }

    const { activation_token, activation_token_expires_at } = foundUser.dataValues
    const isExpired =
      activation_token_expires_at && new Date(activation_token_expires_at).getTime() < Date.now()

    if (!activation_token || activation_token !== token || isExpired) {
      // eslint-disable-next-line no-console
      console.log(
        `[activation] activate failed for user ${userId}: ${
          isExpired ? 'token expired' : 'token mismatch'
        }`
      )
      res.status(401).send({
        message: isExpired ? 'user.activation.token.expired' : 'user.activation.token.invalid'
      })
      return
    }

    const userUpdate = await models.User.update(
      {
        activation_token: null,
        activation_token_sent_at: null,
        activation_token_expires_at: null,
        email_verified: true
      },
      { where: { id: foundUser.dataValues.id }, returning: true, plain: true }
    )
    // eslint-disable-next-line no-console
    console.log(`[activation] activate success for user ${userId}`)
    res.send(userUpdate[1])
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('[activation] activate error', error)
    res.status(401).send(error)
  }
}

export const resendActivationEmail = async (req: any, res: any) => {
  const { id: userId } = req.user
  try {
    const foundUser = await models.User.findOne({ where: { id: userId } })
    if (!foundUser) {
      res.status(401).send({ message: 'user.not.exist' })
      return
    }

    if (foundUser.dataValues.email_verified) {
      // eslint-disable-next-line no-console
      console.log(`[activation] resend no-op: user ${userId} already verified`)
      res.send(foundUser)
      return
    }

    const { activation_token_sent_at } = foundUser.dataValues
    if (
      activation_token_sent_at &&
      Date.now() - new Date(activation_token_sent_at).getTime() < RESEND_ACTIVATION_COOLDOWN_MS
    ) {
      // eslint-disable-next-line no-console
      console.log(`[activation] resend throttled for user ${userId}`)
      res.status(429).send({ message: 'user.activation.resend.too_many_requests' })
      return
    }

    const token = models.User.generateToken()
    const userUpdate = await models.User.update(
      {
        activation_token: token,
        activation_token_sent_at: new Date(),
        activation_token_expires_at: new Date(Date.now() + ACTIVATION_TOKEN_TTL_MS)
      },
      { where: { id: foundUser.dataValues.id }, returning: true, plain: true }
    )
    if (userUpdate[1].dataValues.id) {
      // eslint-disable-next-line no-console
      console.log(`[activation] resend sent for user ${userId}`)
      UserMail.activation(userUpdate[1].dataValues, token)
    }
    res.send(userUpdate[1])
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('[activation] resend error', error)
    res.status(500).send({ message: 'user.activation.resend.error' })
  }
}

export const acceptTerms = async (req: any, res: any) => {
  const { id: userId } = req.user
  const { name, Types } = req.body || {}

  const validName = typeof name === 'string' && name.trim().length > 0 ? name.trim() : undefined
  const validTypes =
    Array.isArray(Types) && Types.length > 0 && Types.every((t: any) => !Number.isNaN(Number(t)))
      ? Types.map((t: any) => Number(t))
      : undefined

  try {
    const updatedUser = await models.sequelize.transaction(async (t: any) => {
      await models.User.update(
        {
          terms_accepted_at: new Date(),
          ...(validName ? { name: validName } : {})
        },
        { where: { id: userId }, transaction: t }
      )

      if (validTypes) {
        const currentUser = await models.User.findByPk(userId, { transaction: t })
        await currentUser.setTypes(validTypes, { transaction: t })
      }

      return models.User.findByPk(userId, { include: [models.Type], transaction: t })
    })

    res.send(updatedUser)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('[terms] accept error', error)
    res.status(500).send({ message: 'user.terms.accept.error' })
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
