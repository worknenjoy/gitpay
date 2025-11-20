const Payout = require('../../modules/payouts')

exports.createPayout = async function createPayout(req, res) {
  try {
    const data = await Payout.payoutBuilds({ ...req.body, userId: req.user.id })
    res.send(data)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('createPayout error on controller', error)
    res.status(error.StatusCodeError || 400).send(error)
  }
}

exports.requestPayout = (req, res) => {
  Payout.payoutRequest({ ...req.body, userId: req.user.id })
    .then((data) => {
      if (data.error) {
        return res.status(400).send(data)
      }
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('requestPayout error on controller', error)
      res.status(error.StatusCodeError || 400).send(error)
    })
}

exports.searchPayout = (req, res) => {
  Payout.payoutSearch({ ...req.query, userId: req.user.id })
    .then((data) => {
      res.send(data)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('searchTransfer error on controller', error)
      res.status(error.StatusCodeError || 400).send(error)
    })
}
