const models = require('./models')
const Promise = require('bluebird')
const url = require('url')
const requestPromise = require('request-promise')
const stripe = require('stripe')(process.env.STRIPE_KEY)

const scripts = {
  accountInfo: () => {
    return models.User
      .findAll(
        {}
      )
      .then(users => {
        if (!users) return false

        if (users.length <= 0) return false

        const accountInfo = users.map(u => {
          if (!u.account_id) {
            return {
              user: u.email,
              active_account: false
            }
          }
          const accountDetails = stripe.accounts.retrieve(u.account_id).then(account => {
            return {
              user: u.email,
              active_account: true,
              account: account
            }
          })
          return accountDetails
        })
        // eslint-disable-next-line no-console
        console.log('users', accountInfo)
        return accountInfo
      }).catch(error => {
        // eslint-disable-next-line no-console
        console.log('error when search user: ', error)
        return false
      })
  },
  deleteInvalidTasks: () => {
    return models.Task
      .findAll(
        {
          where: {
            provider: 'github'
          }
        }
      )
      .then(tasks => {
        const tasksPromises = tasks.map(t => {
          const uri = t.url
          const splitIssueUrl = url.parse(uri).path.split('/')
          const userOrCompany = splitIssueUrl[1]
          const projectName = splitIssueUrl[2]
          const issueId = splitIssueUrl[4]
          if (!userOrCompany || !projectName || !issueId || isNaN(issueId)) return t
          return requestPromise({
            uri,
            resolveWithFullResponse: true
          }).then(response => {
            // eslint-disable-next-line no-console
            // console.log('response status code for issue', response.statusCode, t.url)
            // eslint-disable-next-line no-console
            // console.log('task successfull from Github', t.url)
            return false
          }).catch(e => {
            // eslint-disable-next-line no-console
            // console.log('task with error from Github', t.url)
            return t
          })
        })
        return Promise.all(tasksPromises).then(results => {
          // eslint-disable-next-line no-console
          // console.log('results from tasksPromises', results)
          return results.filter(t => t.id)
        })
      }).catch(error => {
        // eslint-disable-next-line no-console
        console.log('error when search task: ', error)
        return false
      })
  }
}

// if (process.argv[2]) scripts[process.argv[2]]()

module.exports = { scripts }
