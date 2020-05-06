const testEmail = 'teste@gmail.com'
const testPassword = 'teste'
const testName = 'Tester'

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

const registerAndLogin = (agent, registerParams = {}, loginParams = {}) => {
  return register(agent, registerParams)
    .then(() => {
      return login(agent, loginParams)
    })
  }
module.exports = {
  register,
  login,
  registerAndLogin,
}