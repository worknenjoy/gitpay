const Offers = require('../../modules/offers')

// update offer
exports.updateOffer = ({ params, body }, res) =>
  Offers.updateOffer(params, body)
    .then((data) => res.send(data))
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error on task controller update offer', error)
      res.send({ error: error.message })
    })
