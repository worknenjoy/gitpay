import dotenv from 'dotenv'
import type { Dialect, Options } from 'sequelize'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

export type DatabaseConnectionConfig = {
  username: string
  password: string | null
  database: string
} & Options

export type DatabaseUrlConfig = {
  username: string
  password: null
  database: string | undefined
  schema?: string
  host: string
  port: number
  dialect: Dialect
  protocol?: string
  logging?: Options['logging']
}

export const databaseDev: DatabaseConnectionConfig = {
  username: 'postgres',
  password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'postgres',
  database: 'gitpay_dev',
  host: '127.0.0.1',
  port: 5432,
  dialect: 'postgres',
  logging: false
}

export const databaseTest: DatabaseConnectionConfig = {
  username: 'postgres',
  password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'postgres',
  database: 'gitpay_test',
  host: '127.0.0.1',
  port: 5432,
  dialect: 'postgres',
  logging: false
}

export const databaseProd: DatabaseUrlConfig = {
  username: 'root',
  password: null,
  database: process.env.DATABASE_URL,
  schema: 'public',
  host: '127.0.0.1',
  port: 5432,
  dialect: 'postgres',
  protocol: 'postgres'
}

export const databaseStaging: DatabaseUrlConfig = {
  username: 'root',
  password: null,
  database: process.env.DATABASE_URL,
  schema: 'public',
  host: '127.0.0.1',
  port: 5432,
  dialect: 'postgres',
  protocol: 'postgres'
}

export type OAuthClientSecrets = {
  id: string | undefined
  secret: string | undefined
}

export const facebook: OAuthClientSecrets = {
  id: process.env.FACEBOOK_ID,
  secret: process.env.FACEBOOK_SECRET
}

export const google: OAuthClientSecrets = {
  id: process.env.GOOGLE_ID,
  secret: process.env.GOOGLE_SECRET
}

export const github: OAuthClientSecrets = {
  id: process.env.GITHUB_ID,
  secret: process.env.GITHUB_SECRET
}

export const bitbucket: OAuthClientSecrets = {
  id: process.env.BITBUCKET_ID,
  secret: process.env.BITBUCKET_SECRET
}

export type SlackSecrets = {
  token: string | undefined
  channelId: string | undefined
  webhookUrl: string | undefined
}

export const slack: SlackSecrets = {
  token: process.env.SLACK_TOKEN,
  channelId: process.env.SLACK_CHANNEL_ID,
  webhookUrl: process.env.SLACK_WEBHOOK_URL
}

export type MailchimpSecrets = {
  apiKey: string | undefined
  listId: string | undefined
}

export const mailchimp: MailchimpSecrets = {
  apiKey: process.env.MAILCHIMP_API_KEY,
  listId: process.env.MAILCHIMP_LIST_ID
}

export type SendgridSecrets = {
  apiKey: string | undefined
}

export const sendgrid: SendgridSecrets = {
  apiKey: process.env.SENDGRID_API_KEY
}

const apiHost = process.env.API_HOST || ''

export type OAuthCallbacks = {
  googleCallbackUrl: string
  githubCallbackUrl: string
  facebookCallbackUrl: string
  bitbucketCallbackUrl: string
}

export const oauthCallbacks: OAuthCallbacks = {
  googleCallbackUrl: `${apiHost}/callback/google`,
  githubCallbackUrl: `${apiHost}/callback/github`,
  facebookCallbackUrl: `${apiHost}/callback/facebook`,
  bitbucketCallbackUrl: `${apiHost}/callback/bitbucket`
}

export type Secrets = {
  databaseDev: DatabaseConnectionConfig
  databaseTest: DatabaseConnectionConfig
  databaseStaging: DatabaseUrlConfig
  databaseProd: DatabaseUrlConfig

  facebook: OAuthClientSecrets
  google: OAuthClientSecrets
  github: OAuthClientSecrets
  bitbucket: OAuthClientSecrets

  slack: SlackSecrets
  oauthCallbacks: OAuthCallbacks

  mailchimp: MailchimpSecrets
  sendgrid: SendgridSecrets
}

const secrets: Secrets = {
  databaseDev,
  databaseTest,
  databaseStaging,
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

export default secrets
