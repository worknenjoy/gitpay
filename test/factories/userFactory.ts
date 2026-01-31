import Models from '../../src/models'
const models = Models as any

export const UserFactory = async (paramsOverwrite: any = {}) => {
  const defaultParams = {
    username: `testuser_${Math.random().toString(36).substring(7)}`,
    email: `testuser_${Math.random().toString(36).substring(7)}@example.com`,
    password: 'password123'
  }
  const user = await models.User.create({ ...defaultParams, ...paramsOverwrite })
  return user
}
