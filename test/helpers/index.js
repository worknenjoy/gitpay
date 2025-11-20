const models = require('../../src/models')
const testEmail = `teste+${Math.random() * 100}@gmail.com`
const testPassword = 'test12345678'
const testName = 'Test'

const register = (agent, params = {}) => {
  params.email = params.email || testEmail
  params.password = params.password || testPassword
  params.confirmPassword = params.password || testPassword
  params.name = params.name || testName
  params.customer_id = params.customer_id
  params.recover_password_token = params.recover_password_token
  params.account_id = params.account_id
  params.provider_username = params.provider_username
  params.provider = params.provider
  return agent.post('/auth/register').send(params)
}

const login = (agent, params = {}) => {
  params.username = params.email || testEmail
  params.password = params.password || testPassword
  return agent.post('/authorize/local').send(params).type('form')
}

const activate = (agent, res) => {
  return agent.get(`/auth/activate?token=${res.body.activation_token}&userId=${res.body.id}`)
}

const registerAndLogin = async (agent, params = {}) => {
  try {
    const a = await register(agent, params)
    try {
      await activate(agent, a)
      try {
        const res = await login(agent, params)
        return { body: a.body, headers: res.headers }
      } catch (e) {
        console.log('error on login', e)
      }
    } catch (e) {
      console.log('error on activate', e)
    }
  } catch (e) {
    console.log('error on register', e)
  }
}

const createTask = (agent, params = {}, userParams = {}) => {
  params.provider = params.provider || 'github'
  params.url = params.url || 'https://github.com/worknenjoy/gitpay/issues/221'
  params.status = params.status || 'open'

  return registerAndLogin(agent, userParams)
    .then((res) => {
      const user = res.body
      return models.Task.create(
        {
          provider: params.provider || 'github',
          url: params.url,
          status: params.status,
          userId: user.id
        },
        {
          include: [models.User]
        }
      )
        .then((task) => {
          return task
        })
        .catch((e) => {
          console.log('error on createTask', e)
        })
    })
    .catch((e) => {
      console.log('error on registerAndLogin', e)
    })
}

const createAssign = (agent, params = {}, userParams = {}) => {
  return register(agent, {
    ...userParams,
    email: `${Math.random()}anotheruser@example.com`,
    password: '123345',
    confirmPassword: '123345',
    name: 'Foo Bar',
    account_id: 'acct_1Gqj2tGjYvP2Yx5R'
  })
    .then((res) => {
      const user = res.body
      return models.Assign.create(
        {
          TaskId: params.taskId,
          userId: user.id
        },
        {
          include: [models.User]
        }
      )
        .then((assigned) => {
          const assignedData = assigned.dataValues
          return models.Task.update(
            { assigned: assignedData.id },
            { where: { id: assignedData.TaskId } }
          )
            .then((task) => {
              return assigned
            })
            .catch((e) => {
              console.log('error on updateTask', e)
            })
        })
        .catch((e) => {
          console.log('error on createAssign', e)
        })
    })
    .catch((e) => {
      console.log('error on registerAndLogin', e)
    })
}

const createOrder = (params = {}) => {
  params.source_id = params.source_id || '1234'
  params.status = params.status || 'open'
  params.amount = params.amount || 200

  return models.Order.create(params)
    .then((order) => {
      return order
    })
    .catch((e) => {
      console.log('error on create order', e)
    })
}

const createTransfer = (params = {}) => {
  params.transfer_id = params.transfer_id || '1234'
  params.transfer_method = params.transfer_method || 'stripe'

  return models.Transfer.create(params)
    .then((transfer) => {
      return transfer
    })
    .catch((e) => {
      console.log('error on createTransfer', e)
    })
}

const createPayout = (params = {}) => {
  return models.Payout.create(params)
    .then((payout) => {
      return payout
    })
    .catch((e) => {
      console.log('error on createTransfer', e)
    })
}

async function truncateModels(model) {
  await model.truncate({ where: {}, cascade: true, restartIdentity: true }).then(
    function (rowDeleted) {
      // rowDeleted will return number of rows deleted
      if (rowDeleted === 1) {
        console.log('Deleted successfully')
      }
    },
    function (err) {
      console.log(err)
    }
  )
}

module.exports = {
  register,
  login,
  registerAndLogin,
  createTask,
  createOrder,
  createAssign,
  createTransfer,
  createPayout,
  truncateModels
}
