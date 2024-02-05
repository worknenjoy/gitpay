const Payout = require('../../payouts')

exports.createPayout = async function createPayout(req, res) {
  try {
    const data = await Payout.payoutBuilds(req.body)
    res.send(data)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('createPayout error on controller', error)
    res.status(error.StatusCodeError || 400).send(error)
  }
}

exports.searchPayout = (req, res) => {
  Payout.payoutSearch(req.query)
    .then(data => {
      res.send(data)
    }).catch(error => {
      // eslint-disable-next-line no-console
      console.log('searchTransfer error on controller', error)
      res.status(error.StatusCodeError || 400).send(error)
    })
}