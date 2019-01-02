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
  user.userPreferences(req.params)
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.customer = (req, res) => {
  user.userCustomer(req.body)
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.account = (req, res) => {
  user.userAccount(req.params)
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.accountCreate = (req, res) => {
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
  user.userBankAccount(req.params)
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(error)
    })
}
