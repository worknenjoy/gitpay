const user = require('../../users')

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
