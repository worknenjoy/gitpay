const express = require('express')
const sslRedirect = require('heroku-ssl-redirect')
const app = express()
const session = require('express-session')
const compression = require('compression')
require('./models')
const passport = require('passport')
require('./config/passport')
const load = require('./modules/app')
const i18n = require('i18n')
const xFrameOptions = require('x-frame-options')
const { dailyJob } = require('./cron')

if (process.env.NODE_ENV !== 'production') {
  const cors = require('cors')
  app.use(cors())
} else {
  app.use(sslRedirect())
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(xFrameOptions())
app.use(session({
  secret: process.env.SECRET_PHRASE,
  saveUninitialized: true,
  resave: true
}))

i18n.configure({
  directory: process.env.NODE_ENV !== 'production' ? `${__dirname}/locales` : `${__dirname}/locales/result`,
  locales: process.env.NODE_ENV !== 'production' ? ['en'] : ['en', 'br'],
  defaultLocale: 'en',
  updateFiles: false
})

app.use(i18n.init)

dailyJob.start()
app.use(passport.initialize())
app.use(passport.session())

app.set('port', (process.env.PORT || 3000))

app.use(compression())
app.use(express.static(`${__dirname}/frontend/public/`))

app.get('/recruitment', (req, res) => {
  res.redirect('https://gitpay.me/#/recruitment')
})

load.init(app)

module.exports = app;