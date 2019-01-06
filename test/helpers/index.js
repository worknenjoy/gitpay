const testEmail = 'teste@gmail.com'
const testPassword = 'teste'

const register = (agent, params = {}) => {
  params.email = params.email || testEmail
  params.password = params.password || testPassword
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

const registerAndLogin = (agent, registerParams = {}, loginParams = {}) => 
  register(agent, registerParams)
    .then(() => login(agent, loginParams))

module.exports = {
  register,
  login,
  registerAndLogin,
}