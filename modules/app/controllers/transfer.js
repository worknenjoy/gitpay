const Transfer = require('../../transfers')
exports.createTransfer = (req, res) => {
    console.log('res body', req.body)
    Transfer.transferBuilds(req.body)
      .then(data => {
        console.log('data on transferBuilds', data)
        res.send(data)
      }).catch(error => {
        // eslint-disable-next-line no-console
        console.log('createTask error on controller', error)
        res.status(error.StatusCodeError || 400).send(error)
      })
  }