/* eslint-disable no-console */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const i18n = require('i18n')
const moment = require('moment')
const models = require('../../../../models')
const SendMail = require('../../../mail/mail')
const WalletMail = require('../../../mail/wallet')

const stripe = require('../../../shared/stripe/stripe')()

const chargeSucceeded = require('../../../webhooks/chargeSucceeded')
const checkoutSessionCompleted = require('../../../webhooks/checkoutSessionCompleted')

const FAILED_REASON = {
  declined_by_network: 'Denied by card',
  not_sent_to_network: 'Hight risk card, please provide all the information'
}

const CURRENCIES = {
  aud: '$',
  eur: '€',
  brl: 'R$',
  cad: 'C$',
  czk: 'Kč',
  dkk: 'DK',
  hkd: 'HK$',
  inr: '₹',
  jpy: '¥',
  myr: 'RM',
  mxn: 'Mex$',
  nzd: 'NZ$',
  nok: 'kr',
  isk: 'kr',
  pln: 'zł',
  ron: 'lei',
  ngn: '₦',
  sgd: 'S$',
  sek: 'kr',
  chf: 'fr',
  gbp: '£',
  usd: '$',
  bgn: 'лв', // Bulgaria
  hrk: 'kn', // Croatia
  ghs: '₵', // Ghana
  gip: '£', // Gibraltar
  huf: 'Ft', // Hungary
  kes: 'KSh', // Kenya
  php: '₱', // Philippines
  zar: 'R', // South Africa
  thb: '฿', // Thailand
  aed: 'د.إ', // United Arab Emirates
  cop: '$' // Colombia
}

//Function to format amount from cents to decimal format
function formatStripeAmount(amountInCents) {
  // Convert to a number in case it's a string
  let amount = Number(amountInCents);

  // Check if the conversion result is a valid number
  if (isNaN(amount)) {
    return 'Invalid amount';
  }

  // Convert cents to a decimal format and fix to 2 decimal places
  return (amount / 100).toFixed(2);
}

i18n.configure({
  directory: process.env.NODE_ENV !== 'production' ? `${__dirname}/locales` : `${__dirname}/locales/result`,
  locales: process.env.NODE_ENV !== 'production' ? ['en'] : ['en', 'br'],
  defaultLocale: 'en',
  updateFiles: false
})

exports.webhookConnect = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET_CONNECT;

  let event;
  
  try {
    if (process.env.NODE_ENV === 'test') {
      event = JSON.parse(req.body.toString());
    } else {
      event = stripe.webhooks.constructEvent(req.body, sig, secret);
    }
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('✅ Received event:', event.type);

  if (event) {
    const paid = event.data.object.paid || false
    const status = event.data.object.status

    switch (event.type) {
      case 'customer.source.created':
        return models.User.findOne({
          where: {
            customer_id: event.data.object.customer
          }
        }).then((user) => {
          if (!user) {
            return res.status(400).send({ errors: ['User not found'] })
          }
          const language = user.language || 'en'
          i18n.setLocale(language)
          if(event.data.object.name && event.data.object.last4) {
            SendMail.success(
              user.dataValues,
              i18n.__('mail.webhook.payment.success.subject'),
              i18n.__('mail.webhook.payment.success.message', {
                name: event.data.object.name,
                number: event.data.object.last4
              })
            )
          }
          return res.status(200).json(event);
        }).catch(error => res.status(400).send(error))
        /* eslint-disable no-unreachable */
        break
      case 'charge.updated':
        if(event?.data?.object?.source?.id) {
          return models.Order.update(
            {
              paid: paid,
              status: status
            },
            {
              where: {
                source_id: event.data.object.source.id,
                source: event.data.object.id
              },
              returning: true
            }
          )
            .then(order => {
              if (order[0]) {
                return models.User.findOne({
                  where: {
                    id: order[1][0].dataValues.userId
                  }
                })
                  .then(user => {
                    if (user) {
                      if (paid && status === 'succeeded') {
                        const language = user.language || 'en'
                        i18n.setLocale(language)
                        SendMail.success(
                          user.dataValues,
                          i18n.__('mail.webhook.payment.update.subject'),
                          i18n.__('mail.webhook.payment.update.message', { amount: event.data.object.amount / 100 })
                        )
                      }
                    }
                    return res.status(200).json(event);
                  })
                  .catch(e => {
                    return res.status(400).send(e)
                  })
              }
            })
            .catch(e => {
              return res.status(400).send(e)
            })
          }
        return res.status(200).json(event);
        break
      case 'charge.refunded':
        return models.Order.update(
          {
            paid: false,
            status: 'refunded'
          },
          {
            where: {
              source_id: event.data.object.source.id,
              source: event.data.object.id
            },
            returning: true
          }
        )
          .then(order => {
            if (order[0]) {
              return models.User.findOne({
                where: {
                  id: order[1][0].dataValues.userId
                }
              })
                .then(user => {
                  if (user) {
                    if (paid && status === 'succeeded') {
                      const language = user.language || 'en'
                      i18n.setLocale(language)
                      SendMail.success(
                        user.dataValues,
                        i18n.__('mail.webhook.payment.refund.subject'),
                        i18n.__('mail.webhook.payment.refund.message', { amount: event.data.object.amount / 100 })
                      )
                    }
                  }
                  return res.status(200).json(event);
                })
                .catch(e => {
                  return res.status(400).send(e)
                })
            }
          })
          .catch(e => {
            return res.status(400).send(e)
          })
        break
      case 'charge.succeeded':
        return chargeSucceeded(event, paid, status, req, res)
      case 'charge.failed':
        return models.Order.update(
          {
            paid: paid,
            status: status
          },
          {
            where: {
              source_id: event.data.object.source.id,
              source: event.data.object.id
            },
            returning: true
          }
        )
          .then(order => {
            if (order[0]) {
              models.User.findOne({
                where: {
                  id: order[1][0].dataValues.userId
                }
              }).then(user => {
                if (user) {
                  if (status === 'failed') {
                    const language = user.language || 'en'
                    i18n.setLocale(language)
                    SendMail.error(
                      user.dataValues,
                      i18n.__('mail.webhook.payment.unapproved.subject'),
                      i18n.__('mail.webhook.payment.unapproved.message', {
                        reason: FAILED_REASON[event.data.object.outcome.network_status]

                      })
                    )
                    return res.status(200).json(event);
                  }
                }
              })
            }
          })
          .catch(e => {
            return res.status(400).send(e)
          })

        break
      case 'invoice.created':
        // eslint-disable-next-line no-case-declarations
        const shouldCreateWalletOrder = event.data.object.metadata['create_wallet_order']
        if(shouldCreateWalletOrder === 'true' || shouldCreateWalletOrder === true) {
          const walletId = event.data.object.metadata.wallet_id
          const walletOrderExists = await models.WalletOrder.findOne({
            where: {
              source: event.data.object.id
            }
          })
          if(!walletOrderExists) {
            const walletOrder = await models.WalletOrder.create({
              walletId,
              source_id: event.data.object.id,
              currency: event.data.object.currency,
              amount: formatStripeAmount(event.data.object.amount_due),
              description: `created wallet order from stripe invoice. ${event.data.object.description}`,
              source_type: 'stripe',
              source: event.data.object.id,
              ordered_in: new Date(),
              paid: false,
              status: event.data.object.status
            })
          }
        }
        return models.Order.update(
          {
            status: event.data.object.status,
            source: event.data.object.charge
          },
          {
            where: {
              source_id: event.data.object.id
            },
            returning: true
          }
        )
          .then(async order => {
            if (order[0] && order[1].length) {
              const orderUpdated = await models.Order.findOne({
                where: {
                  id: order[1][0].dataValues.id
                },
                include: [models.Task, models.User]
              })
              const userAssign = await models.Assign.findOne({
                where: {
                  id: orderUpdated.Task.dataValues.assigned
                },
                include: [models.Task, models.User]
              })
              const userAssigned = userAssign.dataValues.User.dataValues
              const userTask = orderUpdated.User.dataValues
              if (orderUpdated) {
                const userAssignedlanguage = userAssigned.language || 'en'
                i18n.setLocale(userAssignedlanguage)
                SendMail.success(
                  userAssigned,
                  i18n.__('mail.webhook.invoice.create.subject'),
                  i18n.__('mail.webhook.invoice.create.message', {
                    amount: order[1][0].dataValues.amount
                  })
                )
                const userTaskLanguage = userTask.language || 'en'
                i18n.setLocale(userTaskLanguage)
                SendMail.success(
                  userTask,
                  i18n.__('mail.webhook.payment.update.subject'),
                  i18n.__('mail.webhook.payment.approved.message', {
                    amount: order[1][0].dataValues.amount
                  })
                )
              }
              return res.status(200).json(event);
            }
            return res.status(200).json(event);
          })
          .catch(e => {
            // eslint-disable-next-line no-console
            console.log('error on invoice create webhook', e)
            return res.status(400).send(e)
          })

        break
      case 'invoice.updated':
        // eslint-disable-next-line no-case-declarations
        const shouldCreateWalletOrderOnUpdated = event.data.object.metadata['create_wallet_order']
        if(shouldCreateWalletOrderOnUpdated === 'true' || shouldCreateWalletOrderOnUpdated === true) {
          const walletIdUpdate = event.data.object.metadata.wallet_id
          const walletOrderUpdateExists = await models.WalletOrder.findOne({
            where: {
              source: event.data.object.id
            }
          })
          
          if(!walletOrderUpdateExists) {
            const walletOrderCreateOnUpdate = await models.WalletOrder.create({
              walletId: walletIdUpdate,
              source_id: event.data.object.id,
              currency: event.data.object.currency,
              amount: formatStripeAmount(event.data.object.amount_due),
              description: `created wallet order from stripe invoice. ${event.data.object.description}`,
              source_type: 'stripe',
              source: event.data.object.id,
              ordered_in: new Date(),
              paid: event.data.object.paid,
              status: event.data.object.status
            })
          }
        }
        return models.Order.update(
          {
            paid: event.data.object.status === 'paid',
            status: event.data.object.status === 'paid' ? 'succeeded' : 'failed',
            source: event.data.object.charge
          },
          {
            where: {
              source_id: event.data.object.id
            },
            returning: true
          }
        )
          .then(async order => {
            if (order[0] && order[1].length) {
              const orderUpdated = await models.Order.findOne({
                where: {
                  id: order[1][0].dataValues.id
                },
                include: [models.Task, models.User]
              })
              const userAssign = await models.Assign.findOne({
                where: {
                  id: orderUpdated.Task.dataValues.assigned
                },
                include: [models.Task, models.User]
              })
              const userAssigned = userAssign.dataValues.User.dataValues
              const userTask = orderUpdated.User.dataValues
              if (orderUpdated) {
                if (orderUpdated.status === 'paid') {
                  const userAssignedlanguage = userAssigned.language || 'en'
                  i18n.setLocale(userAssignedlanguage)
                  SendMail.success(
                    userAssigned,
                    i18n.__('mail.webhook.invoice.update.subject'),
                    i18n.__('mail.webhook.invoice.update.message', {
                      amount: order[1][0].dataValues.amount
                    })
                  )
                  const userTaskLanguage = userTask.language || 'en'
                  i18n.setLocale(userTaskLanguage)
                  SendMail.success(
                    userTask,
                    i18n.__('mail.webhook.payment.update.subject'),
                    i18n.__('mail.webhook.payment.approved.message', {
                      amount: order[1][0].dataValues.amount
                    })
                  )
                }
              }
              return res.status(200).json(event);
            }
            return res.status(200).json(event);
          })
          .catch(e => {
            return res.status(400).send(e)
          })

        break
      case 'invoice.paid':
        try {
          const walletOrderUpdate = await models.WalletOrder.update({
            status: event.data.object.status
          }, {
            where: {
              source: event.data.object.id
            }
          })
          return res.status(200).json(event);
        } catch (error) {
          console.log('error', error)
          return res.status(200).json(event);
        }
        break
      case 'invoice.finalized':
        try {
          const invoice = event.data.object
          const invoiceId = invoice.id
          const walletOrder = await models.WalletOrder.findOne({
            where: {
              source: invoiceId
            },
            include: [
              {
              model: models.Wallet,
              include: [models.User]
              }
            ]
            })
          if(walletOrder?.id) {
            WalletMail.invoiceCreated(invoice,  walletOrder, walletOrder.Wallet.User)
            return res.status(200).json(event);
          }
        } catch (error) {
          console.log('error', error)
          return res.status(200).json(event);
        }
      case 'transfer.created':
        models.Transfer.findOne({
          where: {
            transfer_id: event.data.object.id
          }
        }).then(existingTransfer => {
          if (existingTransfer) {
            if(existingTransfer.transfer_method === 'stripe') existingTransfer.status = 'created'
            if(existingTransfer.transfer_method === 'multiple') existingTransfer.status = 'pending'
            return existingTransfer.save().then(t => t)
          }
        })
        
        return models.Task.findOne({
          where: {
            transfer_id: event.data.object.id
          },
          include: [models.User]
        }).then(task => {
          if (task) {
            return models.Assign.findOne({
              where: {
                id: task.dataValues.assigned
              },
              include: [models.User]
            })
              .then(assigned => {
                const language = assigned.dataValues.User.language || 'en'
                i18n.setLocale(language)
                SendMail.success(
                  assigned.dataValues.User.dataValues,
                  i18n.__('mail.webhook.payment.transfer.subject'),
                  i18n.__('mail.webhook.payment.transfer.message', {
                    amount: event.data.object.amount / 100,
                    url: `${process.env.FRONTEND_HOST}/#/task/${task.id}`
                  })
                )
                return res.status(200).json(event);
              })
              .catch(e => {
                return res.status(400).send(e)
              })
          }
          else {
            stripe.accounts.retrieve(event.data.object.destination).then(async (account) => {
              const user = await models.User.findOne({
                where: {
                  email: account.email
                }
              })
              if (user) {
                const language = user.language || 'en'
                i18n.setLocale(language)
              }
              SendMail.success(
                account.email,
                i18n.__('mail.webhook.payment.transfer.subject'),
                i18n.__('mail.webhook.payment.transfer.message', {
                  amount: event.data.object.amount / 100,
                  url: `${event.data.object.id}`
                })
              )
              return res.status(200).json(event);
            }).catch(e => {
              return res.status(400).send(e)
            })
          }
        })
        break
      case 'payout.created':
        return models.User.findOne({
          where: {
            account_id: event.account
          }
        })
          .then(async user => {
            if (user) {
              const existingPayout = await models.Payout.findOne({
                where: {
                  source_id: event.data.object.id
                }
              })

              if (existingPayout) return res.status(200).json(event);
                
              const payout = await models.Payout.build({
                userId: user.dataValues.id,
                amount: event.data.object.amount,
                currency: event.data.object.currency,
                status: event.data.object.status,
                source_id: event.data.object.id,
                description: event.data.object.description,
                method: event.data.object.type
              }).save()

              if (!payout) return res.status(400).send({ error: 'Error to create payout' })
              const date = new Date(event.data.object.arrival_date * 1000)
              const language = user.language || 'en'
              i18n.setLocale(language)
              SendMail.success(
                user.dataValues,
                i18n.__('mail.webhook.payment.transfer.intransit.subject'),
                i18n.__('mail.webhook.payment.transfer.intransit.message', {
                  currency: CURRENCIES[event.data.object.currency],
                  amount: event.data.object.amount / 100,
                  date: moment(date).format('LLL')
                })
              )
              return res.status(200).json(event);
            }
          })
          .catch(e => {
            return res.status(400).send(e)
          })

        break
      case 'payout.failed':
        return models.User.findOne({
          where: {
            account_id: event.account
          }
        })
          .then(user => {
            if (user) {
              const language = user.language || 'en'
              i18n.setLocale(language)
              SendMail.success(
                user.dataValues,
                i18n.__('mail.webhook.payment.transfer.intransit.fail.subject'),
                i18n.__('mail.webhook.payment.transfer.intransit.fail.message', {
                  currency: CURRENCIES[event.data.object.currency],
                  amount: event.data.object.amount / 100
                })
              )
              return res.status(200).json(event);
            }
          })
          .catch(e => {
            return res.status(400).send(e)
          })
        break
      case 'payout.paid':
        return models.Payout.update({
          status: event.data.object.status,
          paid: true
        }, {
          where: {
            source_id: event.data.object.id
          }
        }).then(updatedPayout => {
          if(updatedPayout[0] === 0) return res.status(400).send({ error: 'Error to update payout' })
          return models.User.findOne({
            where: {
              account_id: event.account
            }
          })
            .then(user => {
              if (user) {
                const date = new Date(event.data.object.arrival_date * 1000)
                const language = user.language || 'en'
                i18n.setLocale(language)
                SendMail.success(
                  user.dataValues,
                  i18n.__('mail.webhook.payment.transfer.finished.subject'),
                  i18n.__('mail.webhook.payment.transfer.finished.message', {
                    currency: CURRENCIES[event.data.object.currency],
                    amount: event.data.object.amount / 100,
                    date: date
                  })
                )
                return res.status(200).json(event);
              }
            })
            .catch(e => {
              console.log('error to find user', e)
              return res.status(400).send(e)
            })
        })


        break
      case 'balance.available':
        SendMail.success(
          { email: 'tarefas@gitpay.me' },
          'New balance on your account',
          `
                  <p>We have a new balance:</p>
                  <ul>
                  ${event.data.object.available.map(b => `<li>${b.currency}: ${b.amount}</li>`).join('')}
                  </ul>
              `)
        return res.status(200).json(event);
        break
      default:
        return res.status(200).json(event);
        break
      case 'invoice.payment_succeeded':
        return models.User.findOne(
          {
            where: { email: event.data.object.customer_email }
          }
        ).then(userFound => {
          if (!userFound) {
            return models.User.create({
              email: event.data.object.customer_email,
              name: event.data.object.customer_name,
              country: event.data.object.account_country,
              customer_id: event.data.object.customer[0],
              active: false
            }).then(async user => {
              await user.addType(await models.Type.find({ name: 'funding' }))
              const source_id = event.data.object.id[0]
              if(source_id) {
                return models.Order.update(
                  {
                    status: event.data.object.status,
                    source: event.data.object.charge[0],
                    paid: true,
                    userId: user.dataValues.id
                  },
                  {
                    where: {
                      source_id: event.data.object.id[0]
                    },
                    returning: true
                  }
                ).then(order => {
                  return res.status(200).json(event);
                })
              }
              return res.status(200).json(event);
            })
          }
        }).catch(e => {
          return res.status(400).send(e)
        })
      break;
      case 'invoice.payment_failed':
        // eslint-disable-next-line no-case-declarations
        const walletOrderExists = await models.WalletOrder.findOne({
          where: {
            source: event.data.object.id
          }
        })
        if(!walletOrderExists) {
          const walletId = event.data.object.metadata.wallet_id
          const walletOrder = walletId && await models.WalletOrder.create({
            walletId,
            source_id: event.data.object.id,
            currency: event.data.object.currency,
            amount: formatStripeAmount(event.data.object.amount_due),
            description: `created wallet order from stripe invoice. ${event.data.object.description}`,
            source_type: 'stripe',
            source: event.data.object.id,
            ordered_in: new Date(),
            paid: false,
            status: event.data.object.status
          })
        } else {
          const walletOrderUpdate = await models.WalletOrder.update({
            status: event.data.object.status
          }, {
            where: {
              source: event.data.object.id
            }
          })
        }
        return res.status(200).json(event);
      break;
      case 'checkout.session.completed':
        console.log('checkout.session.completed webhook received')
        return await checkoutSessionCompleted(event, req, res)
      break;
    }
  }
  else {
    return res.send(false)
  }
}