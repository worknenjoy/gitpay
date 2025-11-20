const path = require('path')
const CronJob = require('cron').CronJob
const models = require('../models')
const moment = require('moment')
const i18n = require('i18n')
const DeadlineMail = require('../modules/mail/deadline')
const TaskMail = require('../modules/mail/task')
const OrderCron = require('./orders/orderCron')
const bountyClosedNotPaidComment = require('../modules/bot/bountyClosedNotPaidComment')

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

const TaskCron = {
  weeklyBounties: async () => {
    const tasks = await models.Task.findAll({
      where: {
        value: {
          $gt: 0
        },
        assigned: {
          $eq: null
        },
        status: {
          $eq: 'open'
        }
      },
      include: [models.User]
    })
    if (tasks[0]) {
      TaskMail.weeklyBounties({ tasks })
    }
    return tasks
  },
  latestTasks: async () => {
    const tasks = await models.Task.findAll({
      where: {
        assigned: {
          $eq: null
        },
        status: {
          $eq: 'open'
        }
      },
      limit: 5,
      order: [['id', 'DESC']],
      include: [models.User]
    })
    if (tasks[0]) {
      TaskMail.weeklyLatest({ tasks })
    }
    return tasks
  },
  rememberDeadline: async () => {
    const tasks = await models.Task.findAll({
      where: {
        status: 'in_progress',
        deadline: {
          $lt: moment(new Date()).format(),
          $gt: moment(new Date()).subtract(2, 'days').format()
        }
      },
      include: [models.User]
    })
    if (tasks[0]) {
      tasks.map(async (t) => {
        if (t.assigned) {
          if (t.dataValues && t.assigned) {
            const userAssigned = await models.Assign.findAll({
              where: { id: t.assigned },
              include: [models.User]
            })
            if (userAssigned[0].dataValues) {
              DeadlineMail.deadlineEndOwner(
                t.User.dataValues,
                t.dataValues,
                t.User.name || t.User.username
              )
              DeadlineMail.deadlineEndAssigned(
                userAssigned[0].dataValues.User,
                t.dataValues,
                userAssigned[0].dataValues.User.dataValues.name
              )
            }
          }
        }
      })
    }
    return tasks
  },
  weeklyBountiesClosedNotPaid: async () => {
    const tasks = await models.Task.findAll({
      where: {
        value: {
          $gt: 0
        },
        status: {
          $eq: 'closed'
        },
        paid: {
          $not: true
        }
      },
      include: [models.User]
    })
    if (tasks[0]) {
      tasks.map(async (t) => {
        let userInformation = {}
        if (t.assigned) {
          if (t.dataValues && t.assigned) {
            const userAssigned = await models.Assign.findAll({
              where: { id: t.assigned },
              include: [models.User]
            })
            if (
              userAssigned[0].dataValues &&
              userAssigned[0].dataValues.User.provider === 'github'
            ) {
              userInformation = userAssigned[0].dataValues.User
            }
          }
        }
        bountyClosedNotPaidComment(t, userInformation)
      })
    }
    return tasks
  }
}

const dailyJob = new CronJob({
  // Seconds: 0-59   Minutes: 0-59   Hours: 0-23   Day of Month: 1-31   Months: 0-11 (Jan-Dec)   Day of Week: 0-6 (Sun-Sat)
  cronTime: '0 0 0 * * *', // everyday at 12:00AM
  onTick: () => {
    //TaskCron.rememberDeadline()
    //OrderCron.verify()
    OrderCron.checkExpiredPaypalOrders()
  }
})

const weeklyJob = new CronJob({
  cronTime: '5 8 * * 0',
  onTick: () => {
    TaskCron.weeklyBounties()
  }
})

const weeklyJobLatest = new CronJob({
  cronTime: '5 8 * * 4',
  onTick: () => {
    TaskCron.latestTasks()
  }
})

const weeklyJobBountiesClosedNotPaid = new CronJob({
  cronTime: '5 8 * * 0',
  onTick: () => {
    TaskCron.weeklyBountiesClosedNotPaid()
  }
})

module.exports = {
  dailyJob,
  weeklyJob,
  weeklyJobLatest,
  weeklyJobBountiesClosedNotPaid,
  TaskCron,
  OrderCron
}
