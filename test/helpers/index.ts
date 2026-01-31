import Models from '../../src/models'
import { SuperAgentTest } from 'supertest'
import { TaskFactory, OrderFactory, AssignFactory, TransferFactory, PayoutFactory } from '../factories'

const models = Models as any
const testPassword = 'test12345678'
const testName = 'Test'

const generateTestEmail = (): string => `teste+${Math.random()}@gmail.com`

interface RegisterParams {
  email?: string
  password?: string
  confirmPassword?: string
  name?: string
  customer_id?: string
  recover_password_token?: string
  account_id?: string
  provider_username?: string
  provider?: string
}

interface LoginParams {
  email?: string
  username?: string
  password?: string
}

interface TaskParams {
  provider?: string
  url?: string
  status?: string
}

interface AssignParams {
  taskId?: number
}

interface OrderParams {
  source_id?: string
  status?: string
  amount?: number
  [key: string]: any
}

interface TransferParams {
  transfer_id?: string
  transfer_method?: string
  [key: string]: any
}

const register = (agent: SuperAgentTest, params: RegisterParams = {}) => {
  params.email = params.email || generateTestEmail()
  params.password = params.password || testPassword
  params.confirmPassword = params.password || testPassword
  params.name = params.name || testName
  return agent.post('/auth/register').send(params)
}

const login = (agent: SuperAgentTest, params: LoginParams = {}) => {
  params.username = params.email
  params.password = params.password || testPassword
  return agent.post('/authorize/local').send(params).type('form')
}

const activate = (agent: SuperAgentTest, res: any) => {
  return agent.get(`/auth/activate?token=${res.body.activation_token}&userId=${res.body.id}`)
}

const registerAndLogin = async (agent: SuperAgentTest, params: RegisterParams = {}) => {
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

/**
 * @deprecated Use TaskFactory from test/factories instead
 */
const createTask = async (agent: SuperAgentTest, params: TaskParams = {}, userParams: RegisterParams = {}) => {
  params.provider = params.provider || 'github'
  params.url = params.url || 'https://github.com/worknenjoy/gitpay/issues/221'
  params.status = params.status || 'open'

  try {
    const res = await registerAndLogin(agent, userParams)
    if (!res) {
      throw new Error('registerAndLogin failed')
    }
    const { body: user, headers } = res
    try {
      const task = await TaskFactory({
        provider: params.provider || 'github',
        url: params.url,
        status: params.status,
        userId: user.id
      })
      return { headers, body: task }
    } catch (e) {
      console.log('error on createTask', e)
    }
  } catch (e) {
    console.log('error on registerAndLogin', e)
  }
}

/**
 * @deprecated Use AssignFactory from test/factories instead
 */
const createAssign = async (agent: SuperAgentTest, params: AssignParams = {}, userParams: RegisterParams = {}) => {
  try {
    const res = await register(agent, {
      ...userParams,
      email: `${Math.random()}anotheruser@example.com`,
      password: '123345',
      confirmPassword: '123345',
      name: 'Foo Bar',
      account_id: 'acct_1Gqj2tGjYvP2Yx5R'
    })
    const user = res.body
    try {
      const assigned = await AssignFactory(
        {
          TaskId: params.taskId,
          userId: user.id
        }
      )
      const assignedData = assigned.dataValues
      try {
        await models.Task.update(
          { assigned: assignedData.id },
          { where: { id: assignedData.TaskId } }
        )
        return assigned
      } catch (e) {
        console.log('error on updateTask', e)
      }
    } catch (e) {
      console.log('error on createAssign', e)
    }
  } catch (e) {
    console.log('error on registerAndLogin', e)
  }
}

/**
 * @deprecated Use OrderFactory from test/factories instead
 */
const createOrder = async (params: OrderParams = {}) => {
  params.source_id = params.source_id || '1234'
  params.status = params.status || 'open'
  params.amount = params.amount || 200

  try {
    const order = await OrderFactory(params)
    return order
  } catch (e) {
    console.log('error on create order', e)
  }
}

/**
 * @deprecated Use TransferFactory from test/factories instead
 */
const createTransfer = async (params: TransferParams = {}) => {
  params.transfer_id = params.transfer_id || '1234'
  params.transfer_method = params.transfer_method || 'stripe'

  try {
    const transfer = await TransferFactory(params)
    return transfer
  } catch (e) {
    console.log('error on createTransfer', e)
  }
}

/**
 * @deprecated Use PayoutFactory from test/factories instead
 */
const createPayout = async (params: any = {}) => {
  try {
    const payout = await PayoutFactory(params)
    return payout
  } catch (e) {
    console.log('error on createTransfer', e)
  }
}

async function truncateModels(model: any) {
  try {
    const rowDeleted = await model.truncate({ where: {}, cascade: true, restartIdentity: true })
    // rowDeleted will return number of rows deleted
    if (rowDeleted === 1) {
      console.log('Deleted successfully')
    }
  } catch (err) {
    console.log(err)
  }
}

export {
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
