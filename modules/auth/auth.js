'use strict'

const loading = require('../../loading/loading')

const routerAuth = require('./routes/auth')

const models = [
    '../modules/auth/model/auth'
]

exports.init = (app) => {

    app.use('/', routerAuth);

}