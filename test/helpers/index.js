const testEmail = 'teste@gmail.com' + Math.random()
const testPassword = 'teste' + Math.random()
const testName = 'Tester' + Math.random()

const register = (agent, params = {}) => {
  params.email = params.email || testEmail
  params.password = params.password || testPassword
  params.name = params.name || testName
  return agent
    .post('/auth/register')
    .send(params)
}

const login = (agent, params = {}) => {
  params.email = params.email || testEmail
  params.password = params.password || testPassword
  return agent
    .post('/authorize/local')
    .send(params)
}

const activate = (agent, res) => {
  return agent
    .get(`/auth/activate?token=${res.body.activation_token}&userId=${res.body.id}`)
}

const registerAndLogin = (agent, registerParams = {
  email: testEmail,
  password: testPassword
}, loginParams = {
  email: testEmail,
  password: testPassword
}) => {
  return register(agent, registerParams)
    .then((a) => {
      return activate(agent, a).then((active) => {
        console.log('user activated', active.body)
        return login(agent, loginParams).then(
          (res) => {
            console.log('login response', res.text)
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
module.exports = {
  register,
  login,
  registerAndLogin,
}