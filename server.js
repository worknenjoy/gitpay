const express = require('express')
const cors = require('cors')
const sslRedirect = require('heroku-ssl-redirect')
const app = express()
const session = require('express-session')
const compression = require('compression')
const bodyParser = require('body-parser')
require('./models')
const passport = require('passport')
require('./config/passport')
const load = require('./modules/app')
const i18n = require('i18n')

// const { dailyJob, weeklyJob, weeklyJobLatest, weeklyJobBountiesClosedNotPaid } = require('./cron')

if (process.env.NODE_ENV !== 'production') {
  app.use(cors())
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
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

// dailyJob.start()
// weeklyJob.start()
// weeklyJobLatest.start()
// weeklyJobBountiesClosedNotPaid.start();

app.use(passport.initialize())
app.use(passport.session())
app.use(sslRedirect())

app.set('port', (process.env.PORT || 3000))

app.use(compression())
app.use(express.static(`${__dirname}/frontend/public/`))

app.get('/recruitment', (req, res) => {
  res.redirect('https://gitpay.me/#/recruitment')
})

load.init(app)

app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log('Node app is running on port', app.get('port'))
})

module.exports = app
