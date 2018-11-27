if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const databaseDev = {
  username: 'postgres',
  password: 'postgres',
  database: 'gitpay_dev',
  host: '127.0.0.1',
  port: 5432,
  dialect: 'postgres',
  logging: false
}

const databaseTest = {
  username: 'postgres',
  password: 'postgres',
  database: 'gitpay_test',
  host: '127.0.0.1',
  port: 5432,
  dialect: 'postgres',
  logging: false
}

const databaseProd = {
  username: 'root',
  password: null,
  database: process.env.DATABASE_URL,
  schema: 'public',
  host: '127.0.0.1',
  port: 5432,
  dialect: 'postgres',
  protocol: 'postgres'
}

const facebook = {
  id: process.env.FACEBOOK_ID,
  secret: process.env.FACEBOOK_SECRET
}

const google = {
  id: process.env.GOOGLE_ID,
  secret: process.env.GOOGLE_SECRET
}

const github = {
  id: process.env.GITHUB_ID,
  secret: process.env.GITHUB_SECRET
}

const bitbucket = {
  id: process.env.BITBUCKET_ID,
  secret: process.env.BITBUCKET_SECRET
}

const slack = {
  token: process.env.SLACK_TOKEN,
  channelId: process.env.SLACK_CHANNEL_ID
}

const mailchimp = {
  apiKey: process.env.MAILCHIMP_API_KEY,
  listId: process.env.MAILCHIMP_LIST_ID
}

const sendgrid = {
  apiKey: process.env.SENDGRID_API_KEY
}

const oauthCallbacks = {
  googleCallbackUrl: `${process.env.API_HOST}/callback/google`,
  githubCallbackUrl: `${process.env.API_HOST}/callback/github`,
  facebookCallbackUrl: `${process.env.API_HOST}/callback/facebook`,
  bitbucketCallbackUrl: `${process.env.API_HOST}/callback/bitbucket`
}

module.exports = {
  databaseDev,
  databaseTest,
  databaseProd,
  facebook,
  google,
  github,
  bitbucket,
  slack,
  oauthCallbacks,
  mailchimp,
  sendgrid
}
