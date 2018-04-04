'use strict'

const loading = require('../../loading/loading')

const routerAuth = require('./routes/auth')
const routerTask = require('./routes/tasks')

const models = [
    '../loading/user',
    '../loading/task'
]

exports.init = (app) => {
    app.use('/', routerAuth);
    app.use('/tasks', routerTask);
}
