const { create } = require('core-js/core/object')
const models = require('../../models')
const testEmail = `teste+${Math.random()*100}@gmail.com`
const testPassword = 'test'
const testName = 'Test'

const register = (agent, params = {}) => {
  params.email = params.email || testEmail
  params.password = params.password || testPassword
  params.confirmPassword = params.password || testPassword
  params.name = params.name || testName
  return agent
    .post('/auth/register')
    .send(params)
}

const login = (agent, params = {}) => {
  params.username = params.email || testEmail
  params.password = params.password || testPassword
  return agent
    .post('/authorize/local')
    .send(params)
    .type('form')
}

const activate = (agent, res) => {
  return agent
    .get(`/auth/activate?token=${res.body.activation_token}&userId=${res.body.id}`)
}

const registerAndLogin = (agent, params = {}) => {
  return register(agent, params = {})
    .then((a) => {
      return activate(agent, a).then((active) => {
        return login(agent, params).then(
          (res) => {
            return a
          }
        ).catch((e) => {
          console.log('error on login', e)
        })
      }).catch((e) => {
        console.log('error on activate', e)
      })
    }).catch((e) => {
      console.log('error on register', e)
    })
}

const createTask = (agent, params = {}) => {

  params.provider = params.provider || 'github'
  params.url = params.url || 'https://github.com/worknenjoy/gitpay/issues/221'

  return registerAndLogin(agent).then((res) => {
    const user = res.body
    return models.Task.create({
      provider: params.provider || 'github',
      url: params.url,
      userId: user.id
    }).then(task => {
      console.log('task created', task)
      return task
    }).catch((e) => {
      console.log('error on createTask', e)
    })
  }).catch((e) => {
    console.log('error on registerAndLogin', e)
  })
}

const createAssign = (agent, params = {}) => {
  return register(agent,{
    email: 'anotheruser@example.com',
    password: '123345',
    confirmPassword: '123345',
    name: 'Foo Bar'
  }).then((res) => {
    const user = res.body
    console.log('user created', user)
    return models.Assign.create({
      TaskId: params.taskId,
      userId: user.id
    }).then((assigned) => {
      const assignedData = assigned.dataValues
      models.Task.update({assigned: assignedData.id}, {where: {id: assignedData.TaskId}}).then( task => {
        console.log('task updated', task)
      }).catch((e) => {
        console.log('error on updateTask', e)
      })
      return assigned
    }).catch((e) => {
      console.log('error on createAssign', e)
    })
  }).catch((e) => {
    console.log('error on registerAndLogin', e)
  })
}

const createOrder = (params = {}) => {

  params.source_id = params.source_id || '1234'
  params.status = params.status || 'open'
  params.amount = 200

  return models.Order.create(params).then(order => {
    console.log('order created', order)
    return order
  }).catch((e) => {
    console.log('error on createTask', e)
  })
}

module.exports = {
  register,
  login,
  registerAndLogin,
  createTask,
  createOrder,
  createAssign
}