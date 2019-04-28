const CronJob = require('cron').CronJob
const models = require('./models')
const moment = require('moment')
const DeadlineMail = require('./modules/mail/deadline')
const i18n = require('i18n')

i18n.configure({
  directory: `${__dirname}/locales/result`,
  locales: ['en', 'br'],
  defaultLocale: 'en',
  updateFiles: false
})

const TaskCron = {
  rememberDeadline: async () => {
    const tasks = await models.Task.findAll({ where: {
      status: 'in_progress',
      deadline: {
        $lt: moment(new Date()).format(),
        $gt: moment(new Date()).subtract(4, 'days').format()
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
              DeadlineMail.deadlineEndAssigned(t.User.dataValues, t.dataValues, userAssigned[0].dataValues.User.dataValues.name)
            }
          }
        }
      })
    }
    return tasks
  }
}

const job = new CronJob({
  // Seconds: 0-59   Minutes: 0-59   Hours: 0-23   Day of Month: 1-31   Months: 0-11 (Jan-Dec)   Day of Week: 0-6 (Sun-Sat)
  cronTime: '0 0 0 * * *', // everyday at 12:00AM
  onTick: () => {
    const d = new Date()
    // eslint-disable-next-line no-console
    console.log('Log to confirm cron job run at', d)
    TaskCron.rememberDeadline()
  }
})

module.exports = { job, TaskCron }
