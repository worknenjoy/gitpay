import path from 'path'
const models = require('../models')
const Promise = require('bluebird')
const url = require('url')
const requestPromise = require('request-promise')
const i18n = require('i18n')
const stripe = require('../../shared/stripe/stripe')()
const SendMail = require('../modules/mail/mail')

i18n.configure({
  directory:
    process.env.NODE_ENV !== 'production'
      ? path.join(__dirname, '../locales')
      : path.join(__dirname, '../locales', 'result'),
  locales: process.env.NODE_ENV !== 'production' ? ['en'] : ['en', 'br'],
  defaultLocale: 'en',
  updateFiles: false
})

i18n.init()

const newOrExistingProject = async (userOrCompany, projectName, userId) => {
  try {
    const organizationExist = await models.Organization.find({
      where: {
        name: userOrCompany
      },
      include: [models.Project]
    })
    if (organizationExist) {
      const projectFromOrg = await models.Project.find({
        where: {
          name: projectName,
          OrganizationId: organizationExist.id
        },
        include: [models.Organization]
      })
      if (projectFromOrg) {
        return projectFromOrg
      } else {
        const newProject = await organizationExist.createProject({ name: projectName })
        return newProject
      }
    } else {
      const organization = await models.Organization.create({ name: userOrCompany, UserId: userId })
      const project = await organization.createProject({ name: projectName })
      return project
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('error', e)
    throw new Error(e)
  }
}

const calculateTotal = async () => {
  const orders =
    (await models.Order.findAll(
      {},
      {
        where: {
          paid: true
        }
      }
    )) || []
  const total = orders.reduce(async (accPromise, order) => {
    const acc = await accPromise
    if (order.provider === 'stripe') {
      if (!order.source) return acc
      try {
        const charge = await stripe.charges.retrieve(order.source)
        const balanceTransaction = await stripe.balanceTransactions.retrieve(
          charge.balance_transaction
        )

        if (balanceTransaction) {
          return acc + (balanceTransaction.net / 100 - parseFloat(order.amount))
        }

        return acc
      } catch (e) {
        console.log('error on balance script for stripe', e)
        return acc
      }
    }
  }, Promise.resolve(0))

  return total
}

const calculateTotalTransfers = async () => {
  const transfers = await models.Payout.findAll()
  return transfers.reduce((acc, payout) => {
    return acc + (parseFloat(payout.amount) - parseFloat(payout.amount) * 0.92)
  }, 0)
}

const scripts = {
  balance: async () => {
    try {
      const totalFromOrders = await calculateTotal()
      const totalFromTransfers = await calculateTotalTransfers()
      console.log('totalFromOrders', totalFromOrders)
      console.log('totalFromTransfers', totalFromTransfers)
      return {
        payments_fee: totalFromOrders.toFixed(2),
        payouts: totalFromTransfers.toFixed(2)
      }
    } catch (e) {
      console.log('error on balance script', e)
      return 0
    }
  },
  accountInfo: () => {
    return models.User.findAll({})
      .then((users) => {
        if (!users) return false

        if (users.length <= 0) return false

        const accountInfo = users.map((u) => {
          if (!u.account_id) {
            return {
              user: u.email,
              active_account: false
            }
          }
          const accountDetails = stripe.accounts.retrieve(u.account_id).then((account) => {
            return {
              user: u.email,
              active_account: true,
              account: account
            }
          })
          return accountDetails
        })
        // eslint-disable-next-line no-console
        console.log('users', accountInfo)
        return accountInfo
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('error when search user: ', error)
        return false
      })
  },
  deleteInvalidTasks: () => {
    return models.Task.findAll({
      where: {
        provider: 'github'
      },
      include: [models.User]
    })
      .then((tasks) => {
        const tasksPromises = tasks.map((t) => {
          const uri = t.url
          const splitIssueUrl = url.parse(uri).path.split('/')
          const userOrCompany = splitIssueUrl[1]
          const projectName = splitIssueUrl[2]
          const issueId = splitIssueUrl[4]
          if (!userOrCompany || !projectName || !issueId || isNaN(issueId)) return t
          return requestPromise({
            uri,
            resolveWithFullResponse: true
          })
            .then((response) => {
              // eslint-disable-next-line no-console
              // console.log('response status code for issue', response.statusCode, t.url)
              // eslint-disable-next-line no-console
              // console.log('task successfull from Github', t.url)
              return false
            })
            .catch((e) => {
              // eslint-disable-next-line no-console
              // console.log('task with error from Github', t.url)
              return t
            })
        })
        return Promise.all(tasksPromises).then((results) => {
          // eslint-disable-next-line no-console
          // console.log('results from tasksPromises', results)
          const invalidTasksToDelete = results.filter((t) => t.id)
          const invalidTasksDeleted = invalidTasksToDelete.map((invalidTask) => {
            return Promise.all([
              models.History.destroy({ where: { TaskId: invalidTask.id } }),
              models.Order.destroy({ where: { TaskId: invalidTask.id } }),
              models.Assign.destroy({ where: { TaskId: invalidTask.id } }),
              models.Offer.destroy({ where: { taskId: invalidTask.id } }),
              models.Member.destroy({ where: { taskId: invalidTask.id } })
            ]).then((result) => {
              return models.Task.destroy({
                where: {
                  id: invalidTask.id
                }
              }).then((task) => {
                if (task) {
                  const user = invalidTask.User
                  const language = user.language || 'en'
                  i18n.setLocale(language)
                  SendMail.success(
                    user,
                    i18n.__('task.invalid.script.subject'),
                    i18n.__('task.invalid.script.message', {
                      url: invalidTask.url
                    })
                  )
                }
                return invalidTask
              })
            })
          })
          return Promise.all(invalidTasksDeleted).then((result) => result)
        })
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('error when search task: ', error)
        return false
      })
  },
  createProjects: () => {
    return models.Task.findAll({
      where: {
        provider: 'github'
      },
      include: [models.User, models.Project]
    })
      .then((tasks) => {
        const tasksPromises = tasks.filter((t) => {
          if (t.ProjectId) return false
          return true
        })
        return Promise.all(tasksPromises).then((results) => {
          // eslint-disable-next-line no-console
          console.log('results from tasksPromises', results)
          return results.map((task) => {
            const uri = task.url
            const splitIssueUrl = url.parse(uri).path.split('/')
            const userOrCompany = splitIssueUrl[1]
            const projectName = splitIssueUrl[2]
            const issueId = splitIssueUrl[4]
            if (!userOrCompany || !projectName || !issueId || isNaN(issueId)) return task
            return newOrExistingProject(userOrCompany, projectName, task.userId).then((project) => {
              return task.update({ ProjectId: project.id }).then((u) => u)
            })
          })
        })
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('error when search task: ', error)
        return false
      })
  },
  updateAssignsStatus: () => {
    return (
      models.Assign.findAll({
        attributes: ['id', 'TaskId'],
        where: {
          status: null
        }
      })
        .then((assigns) => {
          return assigns.map((a) => {
            return (
              models.Task.findOne({
                attributes: ['status'],
                where: {
                  id: a.dataValues.TaskId
                }
              })
                .then((task) => {
                  if (
                    task.dataValues.status === 'closed' ||
                    task.dataValues.status === 'in_progress'
                  ) {
                    return {
                      id: a.dataValues.id,
                      status: 'accepted'
                    }
                  } else if (task.dataValues.status === 'open') {
                    return {
                      id: a.dataValues.id,
                      status: 'pending'
                    }
                  }
                })
                // eslint-disable-next-line no-console
                .catch((err) => console.log(`error occurred in assigns.map: ${err}`))
            )
          })
        })
        .all()
        .then((updateFields) => {
          return updateFields.forEach((uf) => {
            return models.Assign.update(
              {
                status: uf.status
              },
              {
                where: {
                  id: uf.id
                }
              }
            )
          })
          // eslint-disable-next-line no-console
        })
        .then(console.log('Assigns successfully updated.'))
        // eslint-disable-next-line no-console
        .catch((err) => console.log(`error while updating assigns status: ${err}`))
    )
  }
}

// if (process.argv[2]) scripts[process.argv[2]]()

module.exports = { scripts }
