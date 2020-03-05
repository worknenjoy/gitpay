const models = require('./models')
const moment = require('moment')
const i18n = require('i18n')
const DeadlineMail = require('./modules/mail/deadline')

i18n.configure({
  directory: process.env.NODE_ENV !== 'production' ? `${__dirname}/locales` : `${__dirname}/locales/result`,
  locales: process.env.NODE_ENV !== 'production' ? ['en'] : ['en', 'br'],
  defaultLocale: 'en',
  updateFiles: false
})

i18n.init()

const Report = {
  montlyBounties: async () => {
    const tasks = await models.Task.findAll({ where: {
      value: {
        $gt: 0
      }
    },
    include: [ models.User ]
    })
    // eslint-disable-next-line no-console
    // console.log('tasks from cron job weekly bounties', tasks)
    if (tasks[0]) {
      const taskSort = tasks.sort((ta, tb) => {
        return Math.abs(new Date(ta.created_at) - new Date(tb.created_at))
      })
      let currentObj = {}
      let total = 0
      taskSort.forEach((t) => {
        const currentDate = t.createdAt.toLocaleString('en-GB', { month: 'long', year: 'numeric' })
        currentObj[currentDate] = 0
      })
      taskSort.forEach((t) => {
        const currentDate = t.createdAt.toLocaleString('en-GB', { month: 'long', year: 'numeric' })
        currentObj[currentDate] += parseInt(t.value)
        total += parseInt(t.value)
      })
      currentObj.total = total
      // eslint-disable-next-line no-console
      console.log('tasks', currentObj)
    }
    return new Error('no issues found')
  },
  montlyUsers: async () => {
    const users = await models.User.findAll({
      where: {},
      order: [['id', 'DESC']]
    })

    if (users[0]) {
      const usersSort = users.sort((ua, ub) => {
        return Math.abs(new Date(ua.created_at) - new Date(ub.created_at))
      })
      let currentObj = {}
      let total = 0
      usersSort.forEach((t) => {
        const currentDate = t.createdAt.toLocaleString('en-GB', { month: 'long', year: 'numeric' })
        currentObj[currentDate] = 0
      })
      usersSort.forEach((t) => {
        const currentDate = t.createdAt.toLocaleString('en-GB', { month: 'long', year: 'numeric' })
        currentObj[currentDate] += 1
        total += 1
      })
      currentObj.total = total
      // eslint-disable-next-line no-console
      console.log('users', currentObj)
    }
    return new Error('no issues found')
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

Report.montlyBounties()

Report.montlyUsers()

// module.exports = { Report }
