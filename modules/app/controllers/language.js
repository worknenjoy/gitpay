const languageSearch = require('../../language')

exports.languageSearchController = (req, res) => {
  languageSearch.languageSearch(req.body)
    .then(data => {
      res.status(200).send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('error on types', error)
      res.status(401).send(error)
    })
}
exports.projectLanguageSearchController = (req, res) => {
  languageSearch.projectlanguageSearch(req.body)
    .then(data => {
      res.status(200).send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('error on types', error)
      res.status(401).send(error)
    })
}
