const Promise = require('bluebird')
const requestPromise = require('request-promise')
const stripe = require('../shared/stripe/stripe')()
const transfer = require('../../models/transfer')
const Transfer = require('../../models').Transfer
const Task = require('../../models').Task
const User = require('../../models').User

module.exports = Promise.method(async function transferFetch(id) {
  if (id) {
    const transfer = await Transfer.findOne({
      where: { id },
      include: [
        Task,
        {
          model: User,
          as: 'User'
        },
        {
          model: User,
          as: 'destination'
        }
      ]
    })
    if (transfer.paypal_payout_id) {
      const paypalCredentials = await requestPromise({
        method: 'POST',
        uri: `${process.env.PAYPAL_HOST}/v1/oauth2/token`,
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'en_US',
          Authorization:
            'Basic ' +
            Buffer.from(process.env.PAYPAL_CLIENT + ':' + process.env.PAYPAL_SECRET).toString(
              'base64'
            ),
          'Content-Type': 'application/json',
          grant_type: 'client_credentials'
        },
        form: {
          grant_type: 'client_credentials'
        }
      })
      const paypalToken = JSON.parse(paypalCredentials)['access_token']
      try {
        const paypalTransfer = await requestPromise({
          method: 'GET',
          uri: `${process.env.PAYPAL_HOST}/v1/payments/payouts/${transfer.paypal_payout_id}`,
          headers: {
            Accept: '*/*',
            'Accept-Language': 'en_US',
            Prefer: 'return=representation',
            Authorization: 'Bearer ' + paypalToken,
            'Content-Type': 'application/json'
          },
          json: true
        })
        transfer.dataValues.paypalTransfer = paypalTransfer
      } catch (error) {
        console.error('Error fetching PayPal transfer:', error)
      }
    }
    if (transfer.transfer_id) {
      const stripeTransfer = await stripe.transfers.retrieve(transfer.transfer_id)
      if (stripeTransfer) {
        transfer.dataValues.stripeTransfer = stripeTransfer
      }
    }
    return transfer
  }
})
