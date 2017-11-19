require('dotenv').config()

const databaseDev = {
  username: 'postgres',
  password: 'postgres',
  database: 'gitpay',
  host: '127.0.0.1',
  port: 5432,
  dialect: 'postgres',
  logging: true
}

const databaseTest = {
  username: 'postgres',
  password: 'postgres',
  database: 'gitpay',
  host: '127.0.0.1',
  port: 5432,
  dialect: 'postgres',
  logging: true
}

const databaseProd = {
  username: 'root',
  password: null,
  database: 'gitpay',
  schema: 'public',
  host: '127.0.0.1',
  port: 5432,
  dialect: 'postgres',
  logging: false
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

const oauthCallbacks = {
  googleCallbackUrl: 'http://localhost:5000/callback/google',
  githubCallbackUrl: 'http://localhost:5000/callback/github',
  facebookCallbackUrl: 'http://localhost:5000/callback/facebook'
}

module.exports = { databaseDev, databaseTest, databaseProd, facebook, google, github, oauthCallbacks }
