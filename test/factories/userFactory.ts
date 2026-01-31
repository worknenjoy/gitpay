import Models from '../../src/models'
const models = Models as any

export const UserFactory = async (paramsOverwrite: any = {}) => {
  const defaultParams = {
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'password123'
  }
  const user = await models.User.create({ ...defaultParams, ...paramsOverwrite })
  return user
}
