const typeSearch = require('../../modules/types').typeSearch

exports.typeSearchController = (req, res) => {
  typeSearch(req.body)
    .then((data) => {
      res.status(200).send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error on types', error)
      res.status(401).send(error)
    })
}
