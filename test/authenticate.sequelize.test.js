const models = require('../models')

describe('authenticate', () => {
  it('should authenticate sequelize', (done) => {
    models.sequelize
      .authenticate()
      .then(err => {
        if (err) done(err)
        else done()
      })
      .catch(err => {
        done(err)
      })
  })
})
