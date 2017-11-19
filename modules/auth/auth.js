'use strict'

const loading = require('../../loading/loading')

const routerAuth = require('./routes/auth')

const models = [
    '../loading/user'
]

exports.init = (app) => {

    app.use('/', routerAuth);

}