const Organizations = require('../../modules/organizations')

exports.listOrganizations = (req, res) => {
  Organizations.organizationList(req.params)
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.fetchOrganization = (req, res) => {
  Organizations.organizationFetch(req.params || req.query)
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(false)
    })
}

exports.createOrganization = (req, res) => {
  req.body.userId = req.user.id
  Organizations.organizationBuilds(req.body)
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(error)
    })
}

exports.updateOrganization = (req, res) => {
  req.body.userId = req.user.id
  Organizations.organizationUpdate(req.body)
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(error)
    })
}
