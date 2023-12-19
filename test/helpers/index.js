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

const registerAndLogin = (agent) => {
  return register(agent)
    .then((a) => {
      return activate(agent, a).then((active) => {
        return login(agent).then(
          (res) => {
            return res
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
  params.url = params.url || 'https://github.com/worknenjoy/truppie/issues/120'
  registerAndLogin(agent).then((res) => {
    return agent
      .post('/tasks')
      .send(params)
  })
}

module.exports = {
  register,
  login,
  registerAndLogin,
}