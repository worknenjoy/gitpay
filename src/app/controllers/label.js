const labelSearch = require('../../modules/label').labelSearch

exports.labelSearchController = (req, res) => {
  // Use query parameters for GET requests
  labelSearch(req.query)
    .then((data) => {
      res.status(200).send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error on types', error)
      res.status(401).send(error)
    })
}
