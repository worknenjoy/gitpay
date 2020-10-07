require('../../models')

const routerAuth = require('./routes/auth')
const routerTask = require('./routes/tasks')
const routerUserRole = require('./routes/userRole')
const routerOrder = require('./routes/orders')
const routerWebhook = require('./routes/webhooks')
const routerInfo = require('./routes/info')
const routerOrganization = require('./routes/organization')
const routerContact = require('./routes/contact')

exports.init = (app) => {
  app.use('/', routerAuth)
  app.use('/tasks', routerTask)
  app.use('/roles', routerUserRole)
  app.use('/orders', routerOrder)
  app.use('/webhooks', routerWebhook)
  app.use('/info', routerInfo)
  app.use('/organizations', routerOrganization)
  app.use('/contact', routerContact)
}
