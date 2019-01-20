require('../../models')

const routerAuth = require('./routes/auth')
const routerTask = require('./routes/tasks')
const routerOrder = require('./routes/orders')
const routerWebhook = require('./routes/webhooks')
const routerInfo = require('./routes/info')

exports.init = (app) => {
  app.use('/', routerAuth)
  app.use('/tasks', routerTask)
  app.use('/orders', routerOrder)
  app.use('/webhooks', routerWebhook)
  app.use('/info', routerInfo)
}
