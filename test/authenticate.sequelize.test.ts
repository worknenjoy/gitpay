import Models from '../src/models'

const models = Models as any

describe('authenticate', () => {
  it('should authenticate sequelize', async () => {
    await models.sequelize.authenticate()
  })
})
