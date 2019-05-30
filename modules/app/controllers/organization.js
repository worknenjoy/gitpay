const Organizations = require('../../organizations')

exports.createOrganization = (req, res) => {
  req.body.userId = req.user.id
  Organizations.organizationBuilds(req.body)
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log(error)
      res.send(error)
    })
}
