const CronJob = require('cron').CronJob
const models = require('./models')
const moment = require('moment')
const DeadlineMail = require('./modules/mail/deadline')

const TaskCron = {
  rememberDeadline: async () => {
    const tasks = await models.Task.findAll({ where: {
      status: 'in_progress',
      deadline: {
        $lt: moment().subtract(3, 'days').toDate()
      }
    },
    include: [ models.User ]
    })
    // eslint-disable-next-line no-console
    console.log('tasks from cron job to remember deadline', tasks)
    if (tasks[0]) {
      tasks.map(async t => {
        if (t.assigned) {
          const userAssigned = await models.Assign.findAll({ where: { id: t.assigned }, include: [models.User] })
          DeadlineMail.rememberDeadline(t.User, t, userAssigned.dataValues.User.name)
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
