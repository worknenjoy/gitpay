import Models from '../../models'
import i18n from 'i18n'
import moment from 'moment'
import SendMail from '../mail/mail'
import WalletMail from '../mail/wallet'
import Stripe from '../../client/payment/stripe'
import { FAILED_REASON, CURRENCIES, formatStripeAmount } from './constants'

const models = Models as any
const stripe = Stripe()

export default async function balanceAvailable(event: any, req: any, res: any) {
  SendMail.success(
    { email: 'tarefas@gitpay.me' },
    'New balance on your account',
    `
                  <p>We have a new balance:</p>
                  <ul>
                  ${event.data.object.available.map((b: any) => `<li>${b.currency}: ${b.amount}</li>`).join('')}
                  </ul>
              `
  )
  return res.status(200).json(event)
}
