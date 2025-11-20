const languageSearch = require('../../modules/language')

exports.languageSearchController = (req, res) => {
  // Use query parameters for GET requests
  languageSearch
    .languageSearch(req.query)
    .then((data) => {
      res.status(200).send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error on types', error)
      res.status(401).send(error)
    })
}
exports.projectLanguageSearchController = (req, res) => {
  // Use query parameters for GET requests
  languageSearch
    .projectlanguageSearch(req.query)
    .then((data) => {
      res.status(200).send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error on types', error)
      res.status(401).send(error)
    })
}
