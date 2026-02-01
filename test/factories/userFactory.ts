import Models from '../../src/models'
import * as crypto from 'crypto'
const models = Models as any

export const UserFactory = async (paramsOverwrite: any = {}) => {
  const randomSuffix = crypto.randomBytes(8).toString('hex')
  const defaultParams = {
    username: `testuser_${randomSuffix}`,
    email: `testuser_${randomSuffix}@example.com`,
    password: 'password123'
  }
  const user = await models.User.create({ ...defaultParams, ...paramsOverwrite })
  return user
}
