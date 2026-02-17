import requestPromise from 'request-promise'

import { findTransferByIdForFetch } from './findTransferByIdForFetch'
import { retrieveTransfer } from '../provider/stripe/transfer'

export async function fetchTransfer(id: number) {
  if (!id) return

  const transfer = await findTransferByIdForFetch(id)
  if (!transfer) return

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
    const stripeTransfer = await retrieveTransfer(transfer.transfer_id)
    if (stripeTransfer) {
      transfer.dataValues.stripeTransfer = stripeTransfer
    }
  }

  return transfer
}
