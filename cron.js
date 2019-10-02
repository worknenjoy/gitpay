const CronJob = require('cron').CronJob
const models = require('./models')
const moment = require('moment')
const i18n = require('i18n')
const DeadlineMail = require('./modules/mail/deadline')
const TaskMail = require('./modules/mail/task')

i18n.configure({
  directory: process.env.NODE_ENV !== 'production' ? `${__dirname}/locales` : `${__dirname}/locales/result`,
  locales: process.env.NODE_ENV !== 'production' ? ['en'] : ['en', 'br'],
  defaultLocale: 'en',
  updateFiles: false
})

i18n.init()

const TaskCron = {
  weeklyBounties: async () => {
    const tasks = await models.Task.findAll({ where: {
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
    include: [ models.User ]
    })
    // eslint-disable-next-line no-console
    console.log('tasks from cron job weekly bounties', tasks)
    if (tasks[0]) {
      TaskMail.weeklyBounties({ tasks })
    }
    return tasks
  },
  rememberDeadline: async () => {
    const tasks = await models.Task.findAll({ where: {
      status: 'in_progress',
      deadline: {
        $lt: moment(new Date()).format(),
        $gt: moment(new Date()).subtract(2, 'days').format()
      }
    },
    include: [ models.User ]
    })
    // eslint-disable-next-line no-console
    console.log('tasks from cron job to remember deadline', tasks)
    if (tasks[0]) {
      tasks.map(async t => {
        if (t.assigned) {
          if (t.dataValues && t.assigned) {
            const userAssigned = await models.Assign.findAll({ where: { id: t.assigned }, include: [models.User] })
            if (userAssigned[0].dataValues) {
              DeadlineMail.deadlineEndOwner(t.User.dataValues, t.dataValues, t.User.name || t.User.username)
              DeadlineMail.deadlineEndAssigned(userAssigned[0].dataValues.User, t.dataValues, userAssigned[0].dataValues.User.dataValues.name)
            }
          }
        }
      })
    }
    return tasks
  }
}

const dailyJob = new CronJob({
  // Seconds: 0-59   Minutes: 0-59   Hours: 0-23   Day of Month: 1-31   Months: 0-11 (Jan-Dec)   Day of Week: 0-6 (Sun-Sat)
  cronTime: '0 0 0 * * *', // everyday at 12:00AM
  onTick: () => {
    const d = new Date()
    // eslint-disable-next-line no-console
    console.log('Log to confirm cron daily job run at', d)
    TaskCron.rememberDeadline()
  }
})

const weeklyJob = new CronJob({
  cronTime: '5 8 * * 0',
  onTick: () => {
    const d = new Date()
    // eslint-disable-next-line no-console
    console.log('Log to confirm cron weekly job run at', d)
    TaskCron.weeklyBounties()
  }
})

module.exports = { dailyJob, weeklyJob, TaskCron }
