const Transfer = require('../../modules/transfers')

exports.createTransfer = (req, res) => {
  Transfer.transferBuilds(req.body)
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      res.status(error.StatusCodeError || 400).send(error)
    })
}

exports.updateTransfer = (req, res) => {
  Transfer.transferUpdate(req.body)
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      console.log('error', error)
      res.status(error.StatusCode || 400).send(error)
    })
}

exports.searchTransfer = (req, res) => {
  Transfer.transferSearch(req.query)
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('searchTransfer error on controller', error)
      res.status(error.StatusCodeError || 400).send(error)
    })
}

exports.fetchTransfer = (req, res) => {
  Transfer.transferFetch(req.params.id)
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('searchTransfer error on controller', error)
      res.status(error.StatusCodeError || 400).send(error)
    })
}
