const requestPromise = require('request-promise')
const secrets = require('../../../config/secrets')
const user = require('../../users')
const task = require('../../tasks')

exports.register = (req, res) => {
  user.userExists({ email: req.body.email }).then(userData => {
    if (userData.dataValues && userData.dataValues.email) {
      res.status(403).send({ error: 'user.exist' })
      return
    }
    user.userBuilds(req.body)
      .then(data => {
        res.send(data)
      }).catch(error => {
        // eslint-disable-next-line no-console
        console.log(error)
        res.send(false)
      })
  })
}

exports.searchAll = (req, res) => {
  user.userSearch()
    .then(data => {
      res.send(data)
    }).catch(error => {
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
      Authorization: 'Basic ' + Buffer.from(`${githubClientId}:${githubClientSecret}`).toString('base64')
    },
    body: {
      code
    },
    json: true
  }).then(response => {
    if (response.access_token) {
      return task.taskBuilds({
        provider: 'github',
        // private: true, not yet
        userId,
        url,
        token: response.access_token
      })
        .then(task => {
          res.redirect(`${process.env.FRONTEND_HOST}/#/task/${task.id}`)
          // return res.send(data)
        }).catch(error => {
          // eslint-disable-next-line no-console
          console.log(error)
          // TODO: instead of a response, we need to redirect to an error page
          return res.send(error)
        })
    }
    return res.status(response.access_token ? 200 : 401).send(response)
  }).catch(e => {
    return res.status(401).send(e)
  })
}

exports.authorizeGithubPrivateIssue = (req, res) => {
  const params = req.query
  const uri = encodeURIComponent(`${process.env.API_HOST}/callback/github/private?userId=${params.userId}&url=${params.url}`)
  res.redirect(`https://github.com/login/oauth/authorize?response_type=code&redirect_uri=${uri}&scope=repo&client_id=${secrets.github.id}`)
}

exports.preferences = (req, res) => {
  user.userPreferences({ id: req.user.id })
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.organizations = (req, res) => {
  user.userOrganizations({ id: req.user.id })
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.customer = (req, res) => {
  user.userCustomer({ id: req.user.id })
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.account = (req, res) => {
  user.userAccount({ id: req.user.id })
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.accountCreate = (req, res) => {
  req.body.id = req.user.id
  user.userAccountCreate(req.body)
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.userUpdate = (req, res) => {
  req.body.id = req.user.id
  user.userUpdate(req.body)
    .then(data => {
      res.send(data)
    }).catch(error => {
    // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.accountUpdate = (req, res) => {
  req.body.id = req.user.id
  user.userAccountUpdate(req.body)
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.status(401).send(error)
    })
}

exports.createBankAccount = (req, res) => {
  req.body.id = req.user.id
  user.userBankAccountCreate(req.body)
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(error)
    })
}

exports.userBankAccount = (req, res) => {
  user.userBankAccount({ id: req.user.id })
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(error)
    })
}

exports.deleteUserById = (req, res) => {
  const params = { id: req.params.id }
  user.userDeleteById(params)
    .then((deleted) => {
      res.status(200).send(`${deleted}`)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.status(400).send(error)
    })
}
