let crypto = require('crypto')

const requestPromise = require('request-promise')
const secrets = require('../../config/secrets')
const user = require('../../modules/users')
const models = require('../../models')
const task = require('../../modules/tasks')
const Sendmail = require('../../modules/mail/mail')

exports.register = (req, res) => {
  const { email, name, password } = req.body
  if (name?.length > 72) return res.status(401).send({ message: 'user.name.too.long' })
  if (email?.length > 72) return res.status(401).send({ message: 'user.email.too.long' })
  if (password?.length > 72) return res.status(401).send({ message: 'user.password.too.long' })
  user.userExists({ email }).then((userData) => {
    if (userData.dataValues && userData.dataValues.email) {
      res.status(403).send({ message: 'user.exist' })
      return
    }
    user
      .userBuilds(req.body)
      .then((data) => {
        res.send(data)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error)
        res.send(false)
      })
  })
}

exports.forgotPasswordNotification = async (req, res) => {
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
        html,
      }
      Sendmail.success(message.to, message.subject, message.html)
      res.send(true)
    } else {
      res.status(403).send({ message: 'user.not.exist' })
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const foundUser = await models.User.findOne({
      where: { recover_password_token: req.body.token },
    })
    if (!foundUser) res.status(401)
    const passwordHash = models.User.generateHash(req.body.password)
    if (passwordHash) {
      await models.User.update(
        { password: passwordHash, recover_password_token: null },
        { where: { id: foundUser.dataValues.id } },
      )
      res.send('successfully change password')
    } else {
      res.status(401).send({ message: 'user.no.password.reset' })
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.send(false)
  }
}

exports.changePassword = (req, res) => {
  user
    .userChangePassword({ ...req.body, id: req.user.id })
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.status(400).send({ error: error.message })
    })
}

exports.searchAll = (req, res) => {
  user
    .userSearch(req.query)
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.createPrivateTask = (req, res) => {
  const { userId, url, code } = req.query
  const githubClientId = secrets.github.id
  const githubClientSecret = secrets.github.secret
  return requestPromise({
    method: 'POST',
    uri: 'https://github.com/login/oauth/access_token/',
    headers: {
      'User-Agent': 'octonode/0.3 (https://github.com/pksunkara/octonode) terminal/0.0',
      Authorization:
        'Basic ' + Buffer.from(`${githubClientId}:${githubClientSecret}`).toString('base64'),
    },
    body: {
      code,
    },
    json: true,
  })
    .then((response) => {
      if (response.access_token) {
        return task
          .taskBuilds({
            provider: 'github',
            private: true,
            userId,
            url,
            token: response.access_token,
          })
          .then((task) => {
            res.redirect(`${process.env.FRONTEND_HOST}/#/task/${task.id}`)
            // return res.send(data)
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error)
            // TODO: instead of a response, we need to redirect to an error page
            return res.send(error)
          })
      }
      return res.status(response.access_token ? 200 : 401).send(response)
    })
    .catch((e) => {
      return res.status(401).send(e)
    })
}

exports.activate_user = async (req, res) => {
  const { token, userId } = req.query
  try {
    const foundUser = await models.User.findOne({ where: { activation_token: token, id: userId } })
    if (!foundUser) {
      res.status(401).send({ message: 'user.not.exist' })
    } else {
      const userUpdate = await models.User.update(
        { activation_token: null, email_verified: true },
        { where: { id: foundUser.dataValues.id }, returning: true, plain: true },
      )
      res.send(userUpdate[1])
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    res.status(401).send(error)
  }
}

exports.resend_activation_email = async (req, res) => {
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
        { where: { id: foundUser.dataValues.id }, returning: true, plain: true },
      ))
    if (userUpdate[1].dataValues.id) {
      Sendmail.success(
        userUpdate[1].dataValues,
        'Activate your account',
        `<p>Hi ${name || 'Gitpay user'},</p><p>Click <a href="${process.env.FRONTEND_HOST}/#/activate/user/${id}/token/${token}">here</a> to activate your account.</p>`,
      )
    }
    res.send(userUpdate[1])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
  }
}

exports.authorizeGithubPrivateIssue = (req, res) => {
  const params = req.query
  const uri = encodeURIComponent(
    `${process.env.API_HOST}/callback/github/private?userId=${params.userId}&url=${params.url}`,
  )
  res.redirect(
    `https://github.com/login/oauth/authorize?response_type=code&redirect_uri=${uri}&scope=repo&client_id=${secrets.github.id}`,
  )
}

exports.preferences = (req, res) => {
  user
    .userPreferences({ id: req.user.id })
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.organizations = (req, res) => {
  user
    .userOrganizations({ id: req.user.id })
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.customer = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  user
    .userCustomer({ id: req.user.id })
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.customerCreate = (req, res) => {
  user
    .userCustomerCreate(req.user.id, req.body)
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.customerUpdate = (req, res) => {
  user
    .userCustomerUpdate(req.user.id, req.body)
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.account = (req, res) => {
  user
    .userAccount({ id: req.user.id })
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.accountCreate = (req, res) => {
  req.body.id = req.user.id
  user
    .userAccountCreate(req.body)
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.accountCountries = (req, res) => {
  user
    .userAccountCountries({ id: req.user.id })
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.accountBalance = (req, res) => {
  user
    .userAccountBalance({ account_id: req.user.account_id })
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.accountUpdate = (req, res) => {
  user
    .userAccountUpdate({ userParams: req.user, accountParams: req.body })
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error on account update', error)
      res.status(401).send(error)
    })
}

exports.accountDelete = (req, res) => {
  user
    .userAccountDelete({ userId: req.user.id })
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error on account delete', error)
      res.status(401).send(error)
    })
}

exports.userUpdate = (req, res) => {
  req.body.id = req.user.id
  user
    .userUpdate(req.body)
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.userFetch = (req, res) => {
  const userId = req.user.id
  user
    .userFetch(userId)
    .then((data) => {
      res.status(200).send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.status(400).send(error)
    })
}

exports.createBankAccount = (req, res) => {
  user
    .userBankAccountCreate({ userParams: req.user, bankAccountParams: req.body })
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(error)
    })
}

exports.updateBankAccount = (req, res) => {
  user
    .userBankAccountUpdate({ userParams: req.user, bank_account: req.body })
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(error)
    })
}

exports.userBankAccount = (req, res) => {
  user
    .userBankAccount({ id: req.user.id })
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(error)
    })
}

exports.deleteUserById = (req, res) => {
  const params = { id: req.user.id }
  user
    .userDeleteById(params)
    .then((deleted) => {
      res.status(200).send(`${deleted}`)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.status(400).send(error)
    })
}

exports.getUserTypes = (req, res) => {
  const userId = req.params.id
  user
    .userTypes(userId)
    .then((data) => {
      res.status(200).send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.status(400).send(error)
    })
}
