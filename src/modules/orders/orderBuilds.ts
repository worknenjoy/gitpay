import models from '../../models'
// @ts-ignore - url-search-params has no type definitions
import URLSearchParams from 'url-search-params'
import * as URL from 'url'
import Decimal from 'decimal.js'
import Sendmail from '../../mail/mail'
import { userCustomerCreate } from '../users/userCustomerCreate'
import { PaypalConnect } from '../../client/provider/paypal'
import { getDefaultPaymentProviderName, getPaymentProvider } from '../../providers'
const slack = require('../../shared/slack')

const currentModels = models as any

type OrderBuildsParams = {
  source_id?: string
  source_type?: string
  currency: string
  provider?: string
  amount: number
  email: string
  userId: number
  taskId: number
  plan?: string
  customer_id?: string
  walletId?: number
}

export async function orderBuilds(orderParameters: OrderBuildsParams) {
  // Config-only global switch: prefer PAYMENT_PROVIDER when client omits/overrides card PSP
  const resolvedProvider =
    orderParameters.provider ||
    (orderParameters.source_type === 'wallet-funds' ? 'wallet' : getDefaultPaymentProviderName())

  orderParameters.provider = resolvedProvider

  const { source_id, source_type, currency, provider, amount, email, userId, taskId, plan } =
    orderParameters
  const taskUrl = `${process.env.API_HOST}/#/task/${orderParameters.taskId}`
  const order = await currentModels.Order.build({
    source_id: source_id || 'internal_' + Math.random(),
    source_type: source_type,
    currency: currency,
    provider: provider,
    amount: amount,
    email: email,
    userId: userId,
    TaskId: taskId,
    include: [
      currentModels.User,
      {
        association: currentModels.Order.Plan,
        include: [currentModels.Plan.plan]
      }
    ]
  }).save()

  if (plan === 'open source') {
    const planFeeBasedOnPrice = amount >= 5000 ? 'Open Source - no fee' : 'Open Source - default'
    const planSchema = await currentModels.PlanSchema.findOne({
      where: {
        plan: plan,
        name: planFeeBasedOnPrice,
        feeType: 'charge'
      }
    })

    await order.createPlan({
      plan: plan,
      PlanSchemaId: planSchema.id,
      fee: parseInt(planSchema.fee) > 0 ? (planSchema.fee / 100) * amount : 0,
      feePercentage: planSchema.fee
    })
  }

  const orderCreated = await order.reload({
    include: [
      { model: currentModels.Task },
      { model: currentModels.User },
      {
        model: currentModels.Plan,
        include: [{ model: currentModels.PlanSchema }]
      }
    ]
  })
  const orderUserModel = orderCreated.User
  const orderUser = orderUserModel.dataValues
  const taskTitle = orderCreated?.Task?.dataValues?.title || ''
  const percentage = orderCreated.Plan?.feePercentage

  if (
    (orderParameters.provider === 'stripe' || orderParameters.provider === 'whop') &&
    orderParameters.source_type === 'invoice-item'
  ) {
    const amountWithFee =
      parseFloat(String(orderParameters.amount)) * (1 + (percentage || 0) / 100)

    if (orderParameters.provider === 'stripe' && !orderParameters.customer_id) {
      const newCustomer = await userCustomerCreate(orderUser.id, { email: orderUser.email })
      orderParameters.customer_id = newCustomer.id
      orderUserModel.reload()
    }

    const paymentProvider = getPaymentProvider(orderParameters.provider)
    const invoice = await paymentProvider.createInvoice({
      purpose: 'bounty_order',
      amount: amountWithFee,
      currency: orderParameters.currency || 'usd',
      customerEmail: orderParameters.email || orderUser.email,
      customerName: orderUser.name || orderUser.username,
      customerId: orderParameters.customer_id,
      dueDays: 30,
      description:
        'Development service for solving an issue on Gitpay: ' + taskTitle + '(' + taskUrl + ')',
      metadata: {
        task_id: String(orderParameters.taskId),
        order_id: String(orderCreated.dataValues.id),
        purpose: 'bounty_order'
      }
    })

    if (process.env.NODE_ENV !== 'test' && invoice.hostedUrl) {
      Sendmail.success(
        { ...orderUser, email: orderParameters.email },
        'Invoice created',
        `An invoice has been created for the task: ${taskUrl}, you can pay it by clicking on the following link: ${invoice.hostedUrl}`
      )
    }

    const orderUpdated = await orderCreated.update(
      {
        source_id: invoice.invoiceId,
        payment_url: invoice.hostedUrl || null,
        provider: paymentProvider.name,
        status: invoice.status || 'open'
      },
      {
        where: {
          id: orderCreated.dataValues.id
        },
        include: [{ model: currentModels.User }]
      }
    )
    return orderUpdated
  }

  // Whop embedded bounty checkout: create session for frontend WhopCheckoutEmbed
  if (orderParameters.provider === 'whop' && orderParameters.source_type !== 'wallet-funds') {
    const paymentProvider = getPaymentProvider('whop')
    const totalPrice = currentModels.Plan.calcFinalPrice
      ? currentModels.Plan.calcFinalPrice(orderParameters.amount, orderParameters.plan)
      : parseFloat(String(orderParameters.amount)) * (1 + (percentage || 0) / 100)

    const checkout = await paymentProvider.createBountyCheckout({
      amount: totalPrice,
      currency: orderParameters.currency || 'usd',
      description: taskTitle
        ? `Bounty for: ${taskTitle}`
        : `Gitpay bounty order ${orderCreated.dataValues.id}`,
      metadata: {
        order_id: String(orderCreated.dataValues.id),
        task_id: String(orderParameters.taskId),
        purpose: 'bounty_order'
      },
      customerEmail: orderParameters.email || orderUser.email
    })

    const orderUpdated = await orderCreated.update(
      {
        source_id: checkout.sourceId,
        payment_url: checkout.paymentUrl || null,
        provider: 'whop',
        status: checkout.status || 'open',
        // session id for embed (also in source_id)
        token: checkout.sessionId || checkout.sourceId
      },
      {
        where: {
          id: orderCreated.dataValues.id
        }
      }
    )
    return orderUpdated
  }

  if (orderParameters.provider === 'paypal') {
    const totalPrice = currentModels.Plan.calcFinalPrice(
      orderParameters.amount,
      orderParameters.plan
    )
    const paymentData = await PaypalConnect({
      method: 'POST',
      uri: `${process.env.PAYPAL_HOST}/v2/checkout/orders`,
      body: {
        intent: 'AUTHORIZE',
        purchase_units: [
          {
            amount: {
              value: totalPrice,
              currency_code: orderParameters.currency
            },
            description: 'Development services provided by Gitpay'
          }
        ],
        application_context: {
          return_url: `${process.env.API_HOST}/orders/authorize`,
          cancel_url: `${process.env.API_HOST}/orders/authorize`
        },
        payer: {
          payment_method: 'paypal'
        }
      }
    })
    const paymentUrl = paymentData.links[1].href
    const resultUrl = URL.parse(paymentUrl)
    const searchParams = new URLSearchParams(resultUrl.search)

    const orderUpdated = await orderCreated.update(
      {
        source_id: paymentData.id,
        authorization_id:
          paymentData.purchase_units &&
          paymentData.purchase_units[0] &&
          paymentData.purchase_units[0].payments &&
          paymentData.purchase_units[0].payments.authorizations[0].id,
        payment_url: paymentUrl,
        token: searchParams.get('token')
      },
      {
        where: {
          id: orderCreated.dataValues.id
        }
      }
    )

    return orderUpdated
  }

  if (orderParameters.provider === 'wallet' && orderParameters.source_type === 'wallet-funds') {
    const wallet = await currentModels.Wallet.findOne({
      where: {
        id: orderParameters.walletId
      }
    })

    if (!wallet) {
      throw new Error(`Wallet with id ${orderParameters.walletId} not found`)
    }

    // Wallet balance is calculated from WalletOrders via afterFind hook
    // The balance field is updated by the hook after findOne
    // Convert to Decimal for comparison (balance is a string after hook processing)
    const currentBalance = new Decimal(wallet.balance || '0.00')
    const enoughBalance = currentBalance.greaterThanOrEqualTo(new Decimal(orderParameters.amount))

    if (!enoughBalance) {
      throw new Error(
        `Not enough balance. current: ${currentBalance}, amount: ${orderParameters.amount}`
      )
    }

    const orderUpdated = await orderCreated.update(
      {
        status: 'succeeded',
        source_id: `${wallet.id}`,
        source_type: 'wallet-funds',
        paid: true
      },
      {
        where: {
          id: orderCreated.dataValues.id
        }
      }
    )

    // Send Slack notification for wallet payment (paid immediately)
    // Note: This only runs for wallet payments that complete successfully
    // Reload order with associations to ensure Task and User are available
    const orderWithAssociations = await currentModels.Order.findByPk(orderCreated.dataValues.id, {
      include: [currentModels.Task, currentModels.User]
    })

    if (orderWithAssociations && orderWithAssociations.Task && orderWithAssociations.User) {
      const orderData = {
        amount: orderCreated.dataValues.amount,
        currency: orderCreated.dataValues.currency || 'USD'
      }
      await slack.notifyBounty(
        orderWithAssociations.Task,
        orderData,
        orderWithAssociations.User,
        'wallet payment'
      )
    }

    return orderUpdated
  }

  return orderCreated
}
