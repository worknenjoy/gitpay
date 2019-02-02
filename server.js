const express = require('express')
const cors = require('cors')
const sslRedirect = require('heroku-ssl-redirect')
const app = express()
const session = require('express-session')
const bodyParser = require('body-parser')
require('./models')
const passport = require('passport')
require('./config/passport')
const load = require('./modules/app')
const feed = require('feed-read')
const i18n = require('i18n')

const { job } = require('./cron')
job.start()

if (process.env.NODE_ENV !== 'production') {
  app.use(cors())
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SECRET_PHRASE
}))

i18n.configure({
  directory: `${__dirname}/locales/result`,
  locales: ['en', 'br'],
  defaultLocale: 'en',
  updateFiles: false
})

app.use(i18n.init)

app.use(passport.initialize())
app.use(passport.session())
app.use(sslRedirect())

app.set('port', (process.env.PORT || 3000))

app.use(express.static(`${__dirname}/frontend/public/`))

app.get('/octos', (req, res) => {
  feed('http://feeds.feedburner.com/Octocats', (err, articles) => {
    if (err) throw err
    const article = articles[Math.floor(Math.random() * articles.length)]
    // eslint-disable-next-line no-console
    console.log(article)
    return res.json(article).end()
  })
})

load.init(app)

app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log('Node app is running on port', app.get('port'))
})

module.exports = app
