const crypto = require('crypto')
const requestPromise = require('request-promise')
const secrets = require('../../config/secrets')
const user = require('../../modules/users')
const models = require('../../models')
const task = require('../../modules/tasks')
const Sendmail = require('../../modules/mail/mail')
const UserMail = require('../../modules/mail/user')

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
        const finalError = isRateLimit
          ? 'API limit reached, please try again later.'
          : errorMessage
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

export const activate_user = async (req: any, res: any) => {
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

export const resend_activation_email = async (req: any, res: any) => {
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
      res.redirect(
        `${process.env.FRONTEND_HOST}/#/profile/user-account/?disconnectAction=success`
      )
    } else {
      res.redirect(`${process.env.FRONTEND_HOST}/#/profile/user-account/?disconnectAction=error`)
    }
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.redirect(`${process.env.FRONTEND_HOST}/#/profile/user-account/?disconnectAction=error`)
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

export const customer = async (req: any, res: any) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const data = await user.userCustomer({ id: req.user.id })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const customerCreate = async (req: any, res: any) => {
  try {
    const data = await user.userCustomerCreate(req.user.id, req.body)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const customerUpdate = async (req: any, res: any) => {
  try {
    const data = await user.userCustomerUpdate(req.user.id, req.body)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const account = async (req: any, res: any) => {
  try {
    const data = await user.userAccount({ id: req.user.id })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const accountCreate = async (req: any, res: any) => {
  req.body.id = req.user.id
  try {
    const data = await user.userAccountCreate(req.body)
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const accountCountries = async (req: any, res: any) => {
  try {
    const data = await user.userAccountCountries({ id: req.user.id })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const accountBalance = async (req: any, res: any) => {
  try {
    const data = await user.userAccountBalance({ account_id: req.user.account_id })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

export const accountUpdate = async (req: any, res: any) => {
  try {
    const data = await user.userAccountUpdate({ userParams: req.user, accountParams: req.body })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on account update', error)
    res.status(401).send(error)
  }
}

export const accountDelete = async (req: any, res: any) => {
  try {
    const data = await user.userAccountDelete({ userId: req.user.id })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log('error on account delete', error)
    res.status(401).send(error)
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

export const createBankAccount = async (req: any, res: any) => {
  try {
    const data = await user.userBankAccountCreate({ userParams: req.user, bankAccountParams: req.body })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(error)
  }
}

export const updateBankAccount = async (req: any, res: any) => {
  try {
    const data = await user.userBankAccountUpdate({ userParams: req.user, bank_account: req.body })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(error)
  }
}

export const userBankAccount = async (req: any, res: any) => {
  try {
    const data = await user.userBankAccount({ id: req.user.id })
    res.send(data)
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(error)
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
